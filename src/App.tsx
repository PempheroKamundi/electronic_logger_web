import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Check, Info } from 'lucide-react';

function App() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-600">Shadcn UI Components</CardTitle>
                    <CardDescription>A showcase of shadcn/ui components with Tailwind</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {showAlert && (
                        <Alert className="border-green-500 bg-green-50">
                            <Check className="h-4 w-4 text-green-600" />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                Your action has been completed successfully.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span>Enable notifications</span>
                        </div>
                        <Switch
                            checked={isEnabled}
                            onCheckedChange={setIsEnabled}
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Info className="h-4 w-4" />
                        <p>Toggle the switch and click the button below to see the alert.</p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button
                        variant="default"
                        onClick={() => setShowAlert(isEnabled)}
                        disabled={!isEnabled}
                    >
                        Show Alert
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default App;