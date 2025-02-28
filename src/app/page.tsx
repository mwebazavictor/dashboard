"use client";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, ShoppingBag, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Select all elements with the class "ball"
    const balls = gsap.utils.toArray(".ball") as HTMLElement[];
    
    // Function to animate a ball to a random position
    function animateBall(ball: HTMLElement) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      gsap.to(ball, {
        duration: 2 + Math.random() * 3, // Duration between 2 and 5 seconds
        x: Math.random() * vw - 100, // Subtract ball size to keep within viewport
        y: Math.random() * vh - 100,
        ease: "power1.inOut",
        onComplete: () => animateBall(ball), // Recursively animate once complete
      });
    }
    
    // Start the animation for each ball
    balls.forEach(ball => {
      // Set different initial positions
      gsap.set(ball, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: 0.1 + Math.random() * 0.4, // Varying opacity for depth effect
      });
      
      animateBall(ball);
    });
  }, []);

  return (
    <div className="relative w-screen h-full overflow-hidden">
      {/* Background gradient and animated balls */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #f3f4f6, #ffffff, #f8f8ff)",
        }}
      >
        {/* Generate 50 balls with varying sizes and opacities */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="ball absolute rounded-full"
            style={{ 
              width: `${4 + Math.random() * 8}px`, 
              height: `${4 + Math.random() * 8}px`,
              backgroundColor: `rgba(180, 180, 180, ${0.1 + Math.random() * 0.4})`,
              left: 0, 
              top: 0 
            }}
          />
        ))}
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <h1>
              Boost your productivity with our AI Agent Suite
            </h1>

          </CardTitle><CardContent>
            <p>
              Automate Businesses Processes to 10x your productivity
            </p>
            <Card>
              <CardContent>
                <Image 
                  width={400}
                  height={200}
                  src="/imgs/banner1.webp" alt="Banner"
                  />
              </CardContent>
            </Card>
          </CardContent>
        </CardHeader>
        </Card>
      </div>
    </div>
  );
}