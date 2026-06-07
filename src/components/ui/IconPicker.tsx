"use client";

import { Calendar, Clock, DollarSign, FileText, Globe, Hash, Heart, Image, Link, Lock, Mail, MapPin, MessageSquare, Phone, Sliders, Star, Tag, Upload, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = { FileText, Mail, Phone, Calendar, Star, Hash, Link, User, Globe, Lock, Heart, Zap, MessageSquare, Image, Upload, DollarSign, Clock, MapPin, Tag, Sliders };

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Object.entries(icons).map(([name, Icon]) => (
        <button key={name} type="button" title={name} onClick={() => onChange(name)} className={cn("flex h-11 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-white", value === name && "border-primary bg-primary/15 text-white")}>
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
