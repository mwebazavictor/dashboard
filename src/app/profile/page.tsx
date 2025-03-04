"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Cookies from "js-cookie";

interface UserDetail {
  name: string;
  email: string;
  role: string;
}

const ProfilePage = () => {
  let userDetails: UserDetail[] = [];

  try {
    const userInfoString = Cookies.get("loggedUserInfo");

    if (userInfoString) {
      const parsedData = JSON.parse(userInfoString);
      if (Array.isArray(parsedData)) {
        userDetails = parsedData;
      } else if (typeof parsedData === "object") {
        userDetails = [parsedData]; // Wrap a single object in an array
      }
    }
  } catch (error) {
    console.error("Error parsing loggedUserInfo:", error);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-xl rounded-2xl bg-white p-6">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          <p className="text-gray-500">Your account details</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {userDetails.length > 0 ? (
            userDetails.map((detail: UserDetail, index: number) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <p className="text-lg font-semibold text-gray-700">
                  Name: <span className="font-normal text-gray-600">{detail.name}</span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  Email: <span className="font-normal text-gray-600">{detail.email}</span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  Role: <span className="font-normal text-gray-600">{detail.role}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No user data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
