from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# MongoDB connection string
uri = "mongodb+srv://malavikavinodp:malavika4@cluster0.m6f1c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    
    # Access the database and collection
    db = client['vehicle_database']  # Use your desired database name
    collection = db['vehicle_details']  # Use your desired collection name
except Exception as e:
    print(e)


# Pydantic model to validate incoming data
class Vehicle(BaseModel):
    vehicle_type: str
    passengers: int
    license_plate: str
    license_number: int
    vehicle_model: str
    

# Route to add vehicle details
@app.post("/add_vehicle/")
async def add_vehicle(vehicle: Vehicle):
    try:
        # Data to insert (from the API request)
        vehicle_data = vehicle.dict()
        
        # Insert the vehicle data into the collection
        result = collection.insert_one(vehicle_data)
        
        # Return a success message along with the inserted ID
        return {"message": "Vehicle added successfully", "vehicle_id": str(result.inserted_id)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding vehicle: {str(e)}")

# To run the FastAPI server, run the following command in your terminal:
# uvicorn filename:app --reload
@app.get("/get_user/{student_id}")
async def get_user(student_id: str):
    user = collection.find_one({"student_id": student_id}, {"_id": 0})
    if user:
        return user
    else:
        return {"message": "User not found"}

@app.post("/add_student/")
async def add_student(student: StudentDetails):
    users_collection = db["users"]
    existing_user = users_collection.find_one({"student_id": student.student_id})
    
    if existing_user:
        return {"message": "Student ID already exists"}
    
    users_collection.insert_one(student.dict())
    return {"message": "Student added successfully"}