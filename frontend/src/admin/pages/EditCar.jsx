import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { getVehicleById,updateVehicle } from "../../services/api";
import Swal from "sweetalert2";

export default function EditCar(){

const {id} = useParams();
const navigate = useNavigate();

const [car,setCar] = useState({
Brand:"",
Model:"",
Year:"",
Type:"",
FuelType:"",
SeatingCapacity:"",
PricePerDay:"",
Status:"",
Color:"",
Description:"",
minimum_rent_km:"",
VehicleNumber:""
});

const [preview,setPreview] = useState("");

useEffect(()=>{
loadCar();
},[]);

const loadCar = async ()=>{

try{

const res = await getVehicleById(id);

const carData = res.data.Data.Car;

setCar(carData);

setPreview(`http://localhost:5000/photos/${carData.carImg}`);

}catch{

Swal.fire("Error","Failed to load car","error");

}

};

const handleChange=(e)=>{

const {name,value,files} = e.target;

if(name==="carImg" && files.length>0){

const reader = new FileReader();

reader.readAsDataURL(files[0]);

reader.onloadend=()=>{
setPreview(reader.result);
setCar({...car,base64:reader.result});
};

}else{

setCar({...car,[name]:value});

}

};

const handleSubmit = async(e)=>{

e.preventDefault();

try{

await updateVehicle(id,car);

Swal.fire("Success","Car Updated","success");

navigate("/admin/cars");

}catch{

Swal.fire("Error","Update failed","error");

}

};

return(

<div className="container mt-5">

<h3>Edit Car</h3>

<form onSubmit={handleSubmit}>

<div className="row">

<div className="col-md-6 mb-3">
<label>Brand</label>
<input
className="form-control"
name="Brand"
value={car.Brand}
onChange={handleChange}
/>
</div>

<div className="col-md-6 mb-3">
<label>Model</label>
<input
className="form-control"
name="Model"
value={car.Model}
onChange={handleChange}
/>
</div>

<div className="col-md-6 mb-3">
<label>Price Per Day</label>
<input
className="form-control"
name="PricePerDay"
value={car.PricePerDay}
onChange={handleChange}
/>
</div>

<div className="col-md-6 mb-3">
<label>Status</label>
<select
className="form-control"
name="Status"
value={car.Status}
onChange={handleChange}
>
<option value="Available">Available</option>
<option value="Unavailable">Unavailable</option>
</select>
</div>

<div className="col-md-12 mb-3">

<img
src={preview}
width="200"
/>

<input
type="file"
name="carImg"
className="form-control mt-2"
onChange={handleChange}
/>

</div>

</div>

<button className="btn btn-primary">
Update Car
</button>

</form>

</div>

);

}