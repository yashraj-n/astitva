from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)
class Story(db.Model):
  __tablename__ = "story"
  id = mapped_column(db.Integer, primary_key=True)
  title = mapped_column(db.String(255))
  image = mapped_column(db.String(255))
  content = mapped_column(db.Text)
  user_id = mapped_column(db.Text)

  def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}
  
class Poem(db.Model):
  __tablename__ = "poem"
  id = mapped_column(db.Integer, primary_key=True)
  content = mapped_column(db.Text)
  user_id = mapped_column(db.Text)

  def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}