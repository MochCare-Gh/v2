
import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [searchType, setSearchType] = useState("name");
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div 
        className={`relative flex flex-col rounded-xl bg-white border shadow-sm transition-all duration-300 ${focused ? 'shadow-md' : ''}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <div className="relative flex w-full items-center">
          <div className="absolute left-3 text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <Input
            className="w-full rounded-xl py-6 pl-10 pr-4 text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 border-none"
            placeholder="Search for mothers..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <div className="absolute right-3">
            <Button size="sm" className="h-9 px-4 rounded-lg">
              Search
            </Button>
          </div>
        </div>
        
        <div className="p-3 border-t">
          <RadioGroup
            value={searchType}
            onValueChange={setSearchType}
            className="flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="name" id="name" />
              <Label htmlFor="name" className="text-sm font-medium cursor-pointer">Name</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ghana-card" id="ghana-card" />
              <Label htmlFor="ghana-card" className="text-sm font-medium cursor-pointer">Ghana Card No.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label htmlFor="phone" className="text-sm font-medium cursor-pointer">Phone No.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nhis" id="nhis" />
              <Label htmlFor="nhis" className="text-sm font-medium cursor-pointer">NHIS No.</Label>
            </div>
          </RadioGroup>
        </div>
      </motion.div>
    </div>
  );
}
