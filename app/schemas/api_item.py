from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ApiIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"]
    path: str = Field(min_length=1, max_length=500)
    description: str = Field(default="", max_length=2000)
    status: Literal["active", "inactive"] = "active"


class ApiOut(ApiIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int