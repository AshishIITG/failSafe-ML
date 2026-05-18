from sqlalchemy import Column, Integer, Float, String
from database import Base

from sqlalchemy import Column, Integer, String
from database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True)

    password = Column(String)

    
class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    prediction = Column(String)

    probability = Column(Float)

    reasons = Column(String)