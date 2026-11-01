from pydantic import BaseModel, ConfigDict, Field


class ProjectIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: str = Field(default="", max_length=1000)


class ProjectOut(ProjectIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    api_count: int = 0