import React from 'react'
import { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { Link, NavLink, useNavigate } from "react-router-dom";

function Appbar(){
    const[userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        fetch("http://localhost:3000/admin/me",{
          method : "GET",
          headers : {
            "Content-type":"application/json",
            "Authorization" : "Bearer " + localStorage.getItem("token")
          }
        }).then((res) => {
          res.json().then((data) => {
            console.log(data);
            if(data.username){
                setUserEmail(data.username);
            }
            
          });
        });
      },[userEmail])
    if(userEmail){
        return(
        
            <div style={{display:"flex",justifyContent:"space-between",position:"sticky"}}>
                <div>
                    <Typography style={{marginLeft:15}}>RapidCourse</Typography>
                </div>
                <div style={{display:"flex"}}>
                    <div>{userEmail}</div>
                    <div style={{marginRight:10}}>
                   <Button variant="contained"
                    onClick={()=>{
                        localStorage.removeItem("token")
                        // navigate('/')
                        window.location='/';
                    }}
                   >Logout</Button>
           
                    </div>                    
                </div>
            </div>
            
    
        )
    }
    return(
        
        <div style={{display:"flex",justifyContent:"space-between",position:"sticky"}}>
            <div>
                <Typography style={{marginLeft:15}}>RapidCourse</Typography>
            </div>
            <div style={{display:"flex"}}>
                <div style={{marginRight:10}}>
               <NavLink to="/Signin"><Button variant="contained">Signin</Button></NavLink>
       
                </div>
                <div>
                <NavLink to="/Signup"><Button variant="contained">Signup</Button></NavLink>
                </div>
                
                
            </div>
        </div>
        

    )
}
export default Appbar;