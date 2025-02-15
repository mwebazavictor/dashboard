"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { getCompany } from "@/services/api";
  import Cookies from "js-cookie";
  import { useState, useEffect } from "react";
  

export default function AgentCard(){
    const [error,setError] = useState<string>();
    const userData = JSON.parse(Cookies.get("loggedUserInfo") ?? '{}');
    const companyId = userData.Company_id;
    const accessToken = Cookies.get("accessToken") ?? '';

    async function getAgents() {
           try{
            const data = await getCompany(companyId, accessToken);
                }catch(err:unknown){
            if(err instanceof Error){
                setError(err.message);
            }else{
                setError('Unknown Error Occured');
            }
        }
    }
    useEffect(() => {
        getAgents
    })
 
    
    return(
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>

    )
}