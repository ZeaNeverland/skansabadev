import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Github, Linkedin, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/assets/images";

const developers = [
  {
    name: "Abyan Dwiartha Surya",
    role: "Project Manager 1 & UI/UX Designer",
    linkedin: "https://www.linkedin.com/in/abyan-ds-3a2b21285?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/AbyanDS",
    email: "thole.aka.abyan@gmail.com",
    avatar: IMAGES.abyan // Resolved by Vite for production
  },
  {
    name: "Aghniya Nainawa Az-zahra",
    role: "Full-stack Developer",
    linkedin: "https://www.linkedin.com/in/aghniya-nainawa-a-59b3b62b6/",
    github: "https://github.com/username2",
    email: "aghniyanainawa.az@gmail.com",
    avatar: IMAGES.nai // Resolved by Vite for production
    },
    {
    name: "Alif Razan Setiawan",
      role: "Project Manager 2 & UI/UX Designer",
    linkedin: "https://www.linkedin.com/in/alif-razan-setiawan-14a193286",
    github: "https://github.com/Shirokami-x",
    email: "alifrazansetiawan123@gmail.com",
    avatar: IMAGES.alip // Resolved by Vite for production
    },
  // Add more developers as needed
];

export function DevelopersModal() {
  const [isHovered, setIsHovered] = useState(false);
  const socialIcons = [
    { icon: Linkedin, color: "hover:text-[#0A66C2]", label: "LinkedIn" },
    { icon: Github, color: "hover:text-gray-800 dark:hover:text-gray-200", label: "GitHub" },
    { icon: Mail, color: "hover:text-[#EA4335]", label: "Email" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            variant="outline" 
            className={cn(
              "group flex items-center justify-center h-14 w-14 rounded-full p-0 bg-background/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl",
              "transition-all duration-300 transform-gpu",
              isHovered ? "w-auto px-4 rounded-full" : "w-14"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <MessageSquare className={cn("h-5 w-5 transition-all", isHovered ? "mr-2" : "m-0")} />
            {isHovered && <span className="whitespace-nowrap text-sm">Tim Pengembang</span>}
            <div className={cn(
              "absolute -z-10 inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100",
              "transition-opacity duration-300"
            )} />
          </Button>
          
          {/* Animated pulse effect */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="absolute h-16 w-16 rounded-full bg-primary/10 animate-ping opacity-75" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 p-0 overflow-hidden bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
        <div className="relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] before:from-primary/5 before:via-transparent before:to-transparent before:opacity-50">
          <DialogHeader className="px-8 pt-8 pb-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Tim Pengembang
              </h2>
              <p className="text-sm text-muted-foreground">
                Hubungi kami untuk pertanyaan lebih lanjut
              </p>
            </div>
          </DialogHeader>

          <div className="px-6 pb-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {developers.map((dev, index) => (
              <div 
                key={index} 
                className="group relative p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {dev.avatar ? (
                        <img 
                          src={dev.avatar} 
                          alt={dev.name}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          {dev.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {dev.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{dev.role}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      {socialIcons.map((social, idx) => (
                        <a
                          key={idx}
                          href={
                            social.label === 'Email' 
                              ? `mailto:${dev.email}` 
                              : social.label === 'LinkedIn' 
                                ? dev.linkedin 
                                : dev.github
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "p-2 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300",
                            social.color
                          )}
                          aria-label={social.label}
                        >
                          <social.icon className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-6 pb-6 pt-2 border-t border-border/30">
            <p className="text-xs text-center text-muted-foreground">
              © {new Date().getFullYear()} Tim Pengembang. All rights reserved.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
