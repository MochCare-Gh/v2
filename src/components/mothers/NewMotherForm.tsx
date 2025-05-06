
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRightIcon, Save } from "lucide-react";

export function NewMotherForm() {
  const [step, setStep] = useState(1);
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const languages = [
    { value: "english", label: "English" },
    { value: "akan", label: "Akan (Twi)" },
    { value: "ewe", label: "Ewe" },
    { value: "ga", label: "Ga" },
    { value: "dagbani", label: "Dagbani" },
    { value: "hausa", label: "Hausa" },
  ];
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">Register New Mother</h1>
        <p className="text-muted-foreground mt-2">
          Enter mother's details to register them into the system
        </p>
      </motion.div>
      
      <div className="mb-8">
        <ol className="flex items-center w-full">
          {[1, 2, 3].map((i) => (
            <li key={i} className={`flex items-center ${i < 3 ? 'w-full' : ''}`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === i ? 'bg-primary text-primary-foreground' : 
                step > i ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {step > i ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  i
                )}
              </div>
              {i < 3 && (
                <>
                  <div className={`flex-1 h-0.5 ${step > i ? 'bg-primary/30' : 'bg-muted'}`}></div>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
      
      <Card className="glass-card rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Personal Information"}
            {step === 2 && "Contact Preferences"}
            {step === 3 && "Registration Details"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Enter the mother's basic information"}
            {step === 2 && "Choose communication preferences"}
            {step === 3 && "Complete registration details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ghana-card">Ghana Card Number</Label>
                  <Input id="ghana-card" placeholder="Enter Ghana Card number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nhis">NHIS Number</Label>
                  <Input id="nhis" placeholder="Enter NHIS number" />
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facility">Facility Code</Label>
                  <Input id="facility" value="GHS-CR-0042" disabled className="bg-muted/50" />
                  <p className="text-xs text-muted-foreground mt-1">Auto-assigned based on your facility</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Communication Channel</Label>
                  <RadioGroup defaultValue="sms" className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="call" id="call" />
                      <Label htmlFor="call" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Phone Call (IVR)</span>
                        <span className="text-xs text-muted-foreground">Automated voice calls in preferred language</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="sms" id="sms" />
                      <Label htmlFor="sms" className="flex flex-col cursor-pointer">
                        <span className="font-medium">SMS</span>
                        <span className="text-xs text-muted-foreground">Text message reminders and notifications</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="flex flex-col cursor-pointer">
                        <span className="font-medium">WhatsApp</span>
                        <span className="text-xs text-muted-foreground">Messages via WhatsApp with rich content</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/40">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Registration Number</span>
                    <span className="font-bold">GHS-CR-0042-00892</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated based on facility code</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Registration Form</Label>
                  <RadioGroup defaultValue="antenatal" className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="antenatal" id="antenatal" />
                      <Label htmlFor="antenatal" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Antenatal Registration</span>
                        <span className="text-xs text-muted-foreground">For new pregnancy registration</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="postnatal" id="postnatal" />
                      <Label htmlFor="postnatal" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Postnatal Registration</span>
                        <span className="text-xs text-muted-foreground">For mothers who have delivered</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general" className="flex flex-col cursor-pointer">
                        <span className="font-medium">General Maternal Care</span>
                        <span className="text-xs text-muted-foreground">For general maternal healthcare</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 3 ? (
            <Button onClick={nextStep}>
              Continue <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button className="bg-primary">
              <Save className="mr-2 h-4 w-4" /> Complete Registration
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="mt-6">
        <Button variant="outline" className="w-full">
          Complete Later
        </Button>
      </div>
    </div>
  );
}
