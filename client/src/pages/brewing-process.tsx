import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Thermometer, 
  Droplets,
  CheckCircle,
  AlertCircle,
  Timer
} from "lucide-react";

interface BrewingStep {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  temperature?: number;
  notes?: string;
  status: 'pending' | 'active' | 'completed' | 'paused';
}

const brewingSteps: BrewingStep[] = [
  {
    id: "milling",
    name: "Milling",
    description: "Crushing the grain to expose the starches",
    duration: 15,
    notes: "Ensure consistent grain crush for optimal extraction",
    status: 'pending'
  },
  {
    id: "mashing",
    name: "Mashing",
    description: "Converting starches to fermentable sugars",
    duration: 60,
    temperature: 152,
    notes: "Maintain steady temperature for enzyme activity",
    status: 'pending'
  },
  {
    id: "lautering",
    name: "Lautering",
    description: "Separating wort from grain husks",
    duration: 45,
    notes: "Slow and steady sparge for clear wort",
    status: 'pending'
  },
  {
    id: "boiling",
    name: "Boiling",
    description: "Sterilizing wort and adding hops",
    duration: 90,
    temperature: 212,
    notes: "Add hops according to recipe schedule",
    status: 'pending'
  },
  {
    id: "cooling",
    name: "Cooling",
    description: "Rapidly cooling wort to fermentation temperature",
    duration: 30,
    temperature: 68,
    notes: "Cool quickly to prevent contamination",
    status: 'pending'
  },
  {
    id: "fermentation",
    name: "Fermentation",
    description: "Yeast converts sugars to alcohol and CO2",
    duration: 10080, // 7 days in minutes
    temperature: 68,
    notes: "Monitor temperature and airlock activity",
    status: 'pending'
  },
  {
    id: "conditioning",
    name: "Conditioning",
    description: "Beer matures and flavors develop",
    duration: 20160, // 14 days in minutes
    temperature: 38,
    notes: "Allow time for flavors to meld and clarify",
    status: 'pending'
  }
];

export default function BrewingProcess() {
  const [steps, setSteps] = useState<BrewingStep[]>(brewingSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && currentStepIndex < steps.length) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setTotalElapsedTime(prev => prev + 1);
      }, 60000); // Update every minute
    }
    
    return () => clearInterval(interval);
  }, [isRunning, currentStepIndex, steps.length]);

  // Check if current step is completed
  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (currentStep && elapsedTime >= currentStep.duration) {
      completeCurrentStep();
    }
  }, [elapsedTime, currentStepIndex]);

  const startProcess = () => {
    setIsRunning(true);
    updateStepStatus(currentStepIndex, 'active');
  };

  const pauseProcess = () => {
    setIsRunning(false);
    updateStepStatus(currentStepIndex, 'paused');
  };

  const resetProcess = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setElapsedTime(0);
    setTotalElapsedTime(0);
    setSteps(brewingSteps.map(step => ({ ...step, status: 'pending' })));
  };

  const completeCurrentStep = () => {
    updateStepStatus(currentStepIndex, 'completed');
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setElapsedTime(0);
      updateStepStatus(currentStepIndex + 1, 'active');
    } else {
      setIsRunning(false);
    }
  };

  const updateStepStatus = (index: number, status: BrewingStep['status']) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status } : step
    ));
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    } else {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      return `${days}d ${hours}h`;
    }
  };

  const getStepIcon = (status: BrewingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <Timer className="h-5 w-5 text-amber-500 animate-pulse" />;
      case 'paused':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const currentStep = steps[currentStepIndex];
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const overallProgress = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brewing Process</h1>
          <p className="text-muted-foreground">
            Visualize and track your brewing workflow with real-time progress
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={startProcess} disabled={currentStepIndex >= steps.length}>
              <Play className="h-4 w-4 mr-2" />
              {currentStepIndex === 0 ? 'Start Brewing' : 'Resume'}
            </Button>
          ) : (
            <Button onClick={pauseProcess} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button onClick={resetProcess} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription>
            {completedSteps} of {steps.length} steps completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={overallProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total Time: {formatTime(totalElapsedTime)}</span>
              <span>{Math.round(overallProgress)}% Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Details */}
      {currentStep && currentStepIndex < steps.length && (
        <Card className="border-2 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStepIcon(currentStep.status)}
              Current Step: {currentStep.name}
            </CardTitle>
            <CardDescription>{currentStep.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={(elapsedTime / currentStep.duration) * 100} 
                className="h-3"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatTime(elapsedTime)} / {formatTime(currentStep.duration)}
                  </span>
                </div>
                
                {currentStep.temperature && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{currentStep.temperature}°F</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={currentStep.status === 'active' ? 'default' : 'secondary'}>
                    {currentStep.status}
                  </Badge>
                </div>
              </div>
              
              {currentStep.notes && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> {currentStep.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Brewing Steps</CardTitle>
          <CardDescription>Complete brewing process workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  index === currentStepIndex
                    ? 'border-amber-300 bg-amber-50 shadow-md'
                    : step.status === 'completed'
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex-shrink-0">
                  {getStepIcon(step.status)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{step.name}</h3>
                    <Badge variant={step.status === 'active' ? 'default' : 'secondary'}>
                      {step.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm font-medium">{formatTime(step.duration)}</div>
                  {step.temperature && (
                    <div className="text-xs text-muted-foreground">
                      {step.temperature}°F
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      {currentStepIndex >= steps.length && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-800">Brewing Complete!</h2>
              <p className="text-green-700">
                Congratulations! Your beer has completed the brewing process.
                Total time: {formatTime(totalElapsedTime)}
              </p>
              <Button onClick={resetProcess} className="mt-4">
                Start New Batch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}