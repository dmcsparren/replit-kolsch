import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowRight, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function SignupPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // User fields
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    // Brewery fields
    breweryName: "",
    breweryType: "",
    location: "",
    foundedYear: "",
    website: "",
    phone: "",
    brewingCapacity: "",
    specialties: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create brewery and user account
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            username: formData.username,
            password: formData.password,
            role: 'owner'
          },
          brewery: {
            name: formData.breweryName,
            type: formData.breweryType,
            location: formData.location,
            foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null,
            website: formData.website,
            phone: formData.phone,
            brewingCapacity: formData.brewingCapacity,
            specialties: formData.specialties,
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }

      const result = await response.json();
      
      toast({
        title: "Welcome to kolsch!",
        description: "Your brewery account has been created successfully.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Brewery Profile</h1>
          <p className="text-gray-600">Help us customize kolsch for your brewery's unique needs</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Brewery Information</CardTitle>
            <CardDescription className="text-amber-100">
              Tell us about your brewery to get the most out of kolsch
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      placeholder="Choose a unique username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Brewery Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Brewery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="breweryName">Brewery Name *</Label>
                    <Input
                      id="breweryName"
                      placeholder="Your Brewery Name"
                      value={formData.breweryName}
                      onChange={(e) => handleInputChange("breweryName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breweryType">Brewery Type *</Label>
                    <Select onValueChange={(value) => handleInputChange("breweryType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brewery type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="microbrewery">Microbrewery</SelectItem>
                        <SelectItem value="brewpub">Brewpub</SelectItem>
                        <SelectItem value="regional">Regional Brewery</SelectItem>
                        <SelectItem value="craft">Craft Brewery</SelectItem>
                        <SelectItem value="production">Production Brewery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      placeholder="2024"
                      value={formData.foundedYear}
                      onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourbrewery.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="brewingCapacity">Annual Brewing Capacity</Label>
                    <Input
                      id="brewingCapacity"
                      placeholder="e.g., 1000 BBL"
                      value={formData.brewingCapacity}
                      onChange={(e) => handleInputChange("brewingCapacity", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialties">Beer Specialties</Label>
                    <Input
                      id="specialties"
                      placeholder="e.g., IPAs, Lagers, Sours"
                      value={formData.specialties}
                      onChange={(e) => handleInputChange("specialties", e.target.value)}
                    />
                  </div>
                </div>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="breweryType">Brewery Type *</Label>
                  <Select onValueChange={(value) => handleInputChange("breweryType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brewery type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nano">Nano Brewery (under 3 BBL)</SelectItem>
                      <SelectItem value="micro">Micro Brewery (3-15 BBL)</SelectItem>
                      <SelectItem value="small">Small Brewery (15-30 BBL)</SelectItem>
                      <SelectItem value="regional">Regional Brewery (30+ BBL)</SelectItem>
                      <SelectItem value="contract">Contract Brewery</SelectItem>
                      <SelectItem value="brewpub">Brewpub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Province"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    placeholder="2024"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                  />
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourbrewery.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brewingCapacity">Annual Brewing Capacity</Label>
                  <Input
                    id="brewingCapacity"
                    placeholder="e.g., 1000 BBL"
                    value={formData.brewingCapacity}
                    onChange={(e) => handleInputChange("brewingCapacity", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Beer Specialties</Label>
                  <Input
                    id="specialties"
                    placeholder="e.g., IPAs, Lagers, Sours"
                    value={formData.specialties}
                    onChange={(e) => handleInputChange("specialties", e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Development Application</p>
                    <p>This is a demo brewery management system. For production use, ensure proper security audits and compliance measures are in place.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Back to Landing
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.breweryName || !formData.breweryType || !formData.location}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                >
                  {isLoading ? (
                    "Creating Profile..."
                  ) : (
                    <>
                      Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Need help? Contact our support team at support@kolsch-brewery.com</p>
        </div>
      </div>
    </div>
  );
}