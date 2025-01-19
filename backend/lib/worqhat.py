import os
from dataclasses import dataclass
from typing import Any, Dict, Optional, TypeVar, Generic
import httpx
import json
from enum import Enum
import time
from pydantic import TypeAdapter, BaseModel
from typing import Literal


class APIError(Exception):
    """Custom exception for API-related errors"""

    def __init__(self, message: str, status_code: Optional[int] = None, response: Optional[Dict] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response = response


class ModelName(str, Enum):
    """Available AI model versions"""
    AICON_V4_LARGE = "aicon-v4-large-160824"


class ResponseFormat(str, Enum):
    """Available response formats"""
    JSON = "json"
    TEXT = "text"


@dataclass
class AuthenticationInfo:
    """Response structure for authentication endpoint"""
    userEmail: str
    orgName: str
    processingTime: float
    processingId: str

    def __repr__(self) -> str:
        return f"Logged in as {self.userEmail} in {self.orgName} in {self.processingTime} seconds"


@dataclass
class TextResponse:
    """Response structure for text generation"""
    text: str


def process_schema_properties(schema: Dict[str, Any], definitions: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recursively process schema properties to handle nested objects and arrays
    """
    if not schema:
        return {}

    if "$ref" in schema:
        # Extract the definition name from the reference
        ref_name = schema["$ref"].split("/")[-1]
        if ref_name in definitions:
            return process_schema_properties(definitions[ref_name], definitions)
        return {"type": "object"}

    if schema["type"] == "array":
        items_schema = schema.get("items", {})
        if "$ref" in items_schema:
            # Handle referenced items
            ref_name = items_schema["$ref"].split("/")[-1]
            if ref_name in definitions:
                return {
                    "type": "array",
                    "items": process_schema_properties(definitions[ref_name], definitions)
                }
        return {"type": "array", "items": process_schema_properties(items_schema, definitions)}

    if "properties" in schema:
        return {
            key: {"type": prop.get("type", "string")}
            for key, prop in schema["properties"].items()
        }

    return {"type": schema.get("type", "object")}


def get_schema_structure(model_class: type[BaseModel]) -> Dict[str, Any]:
    """
    Generate a structured schema from a Pydantic model including nested models
    """
    schema = TypeAdapter(model_class).json_schema()
    required_keys = schema.get('required', [])
    definitions = schema.get('$defs', {})  # Get all definitions

    filtered_schema = {
        key: process_schema_properties(schema["properties"][key], definitions)
        for key in required_keys
        if key in schema["properties"]
    }

    return filtered_schema


T = TypeVar('T')


class WorqHat:
    """
    WorqHat API client for interacting with AI models and services.

    Args:
        api_key: Your WorqHat API key
        model_name: The AI model to use (default: AICON_V4_LARGE)
        base_url: API base URL (default: https://api.worqhat.com/)
        timeout: Request timeout in seconds (default: 30)
    """
    api_key: str

    def __init__(
            self,
            api_key: str,
            model_name: ModelName = ModelName.AICON_V4_LARGE,
            base_url: str = "https://api.worqhat.com/",
            timeout: int = 30
    ):
        self.model_name = model_name
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key

        self.client = httpx.Client(
            base_url=self.base_url,
            timeout=timeout,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },

        )

    def _make_request(
            self,
            method: Literal["GET", "POST"],
            endpoint: str,
            **kwargs
    ) -> Dict[str, Any]:
        """Make HTTP request to API endpoint"""
        try:
            response = self.client.request(method, endpoint, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise APIError(
                f"HTTP error occurred: {str(e)}",
                status_code=getattr(e.response, 'status_code', None),
                response=getattr(e.response, 'json', lambda: None)()
            )
        except Exception as e:
            raise APIError(f"Error occurred: {str(e)}")

    def _generate_json_prompt(self, system: str, structure: type[T]) -> str:
        """Generate system prompt with JSON schema"""
        filtered_schema = get_schema_structure(structure)
        return f"{system} Only send JSON and follow Format (Type is expected data type of variable): {filtered_schema}"

    def multimodal(
            self,
            system: str,
            prompt: str,
            image: str,
            output_structure: type[T],
            randomness: float = 0.5,
    ) -> T:
        """
        Generate text based on both text and image inputs.

        Args:
            system: System message/context
            prompt: User prompt/question
            image: Image URL or base64 encoded image
            output_structure: Dataclass defining the expected response structure
            randomness: Creativity factor (0.0 to 1.0)

        Returns:
            Instance of output_structure containing the generated response
        """
        system_prompt = self._generate_json_prompt(system, output_structure)
        print(system_prompt)
        url = f"{self.base_url}/api/ai/content/v4"
        timeout = httpx.Timeout(10.0, read=None)
        data = httpx.post(
            url,
            headers={
                'Authorization': f'Bearer {self.api_key}',
            },
            files={
                "model": (None, self.model_name),
                "question": (None, prompt),
                "files": ("ss.png.jpg", image),
                'training_data': (None, system_prompt),
                'response_type': (None, ResponseFormat.JSON),
                'randomness': (None, str(randomness)),
            },
            timeout=timeout
        ).json()

        return output_structure(**(json.loads(data["content"])))\

    def multimodal_non_json(
            self,
            system: str,
            prompt: str,
            image: str,
            randomness: float = 0.5,
    ) -> str:
        """
        Generate text based on both text and image inputs.

        Args:
            system: System message/context
            prompt: User prompt/question
            image: Image URL or base64 encoded image
            randomness: Creativity factor (0.0 to 1.0)

        Returns:
            Instance of output_structure containing the generated response
        """
        url = f"{self.base_url}/api/ai/content/v4"
        timeout = httpx.Timeout(10.0, read=None)
        data = httpx.post(
            url,
            headers={
                'Authorization': f'Bearer {self.api_key}',
            },
            files={
                "model": (None, self.model_name),
                "question": (None, prompt),
                "files": ("ss.png.jpg", image),
                'training_data': (None, system),
                'response_type': (None, ResponseFormat.TEXT),
                'randomness': (None, str(randomness)),
            },
            timeout=timeout
        ).json()

        return data["content"]

    def check_authentication(self) -> AuthenticationInfo:
        """Verify API key and get authentication information"""
        data = self._make_request("POST", "authentication")
        return AuthenticationInfo(**data)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.client.close()

    def text_to_image(self, prompt, count=0):
        if count > 10:
            print("Maximum tries attempted could not load image")
            return
        url = "https://api.worqhat.com/api/ai/images/generate/v3"
        api_key = self.api_key
        count += 1

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        print(prompt)
        data = {
            "prompt": [prompt],
            "image_style": "Anime",
            "orientation": "Portrait",
            "output_type": "url"
        }

        timeout = httpx.Timeout(200.0)

        try:
            response = httpx.post(url, headers=headers, json=data, timeout=timeout)
            if response.status_code == 200:
                response_dict = response.json()
                return response_dict['image']
            else:
                print("Request failed with status code:", response.status_code)
                print("Trying again...")
                time.sleep(2)
                return self.text_to_image(prompt, count)

        except httpx.TimeoutException:
            print("Request timed out. Trying again...")
            time.sleep(2)
            return self.text_to_image(prompt, count)

        except httpx.RequestError as e:
            print(f"An error occurred: {e}")
            return None


worqHat = WorqHat(api_key=os.environ["WORQHAT_API_KEY"])
