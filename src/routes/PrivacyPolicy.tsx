import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button.tsx"
import {Link, useNavigate} from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        {/* Left: Back button */}
                        <Button onClick={() => navigate("/home")}>
                            ← Back
                        </Button>

                        {/* Center: Title */}
                        <div className="text-center flex-1">
                            <CardTitle>Privacy Policy</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Last updated: August 18, 2025
                            </p>
                        </div>

                        {/* Right: Empty space equal to Back button for balance */}
                        <div className="w-[120px]" />
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold mb-2">What Our Site Stores</h2>
                        <p>
                            The only data stored by this site is a cached link to the Google Sheet you
                            choose to connect. This cached link exists solely to load the files without
                            asking you to choose it again. No personal data or sheet content is stored on our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Where Your Data Lives</h2>
                        <p>
                            All actual data is stored in Google Sheets, under your Google account.
                            This site simply displays that data — it does not create, modify, or delete
                            files on its own.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">What Our Site Accesses</h2>
                        <p>
                            This site only accesses the specific Google Sheets you choose to connect.
                            It will not access any other files on your computer or in your Google Drive.
                            The only files our site uses outside of Google Sheets are its own internal database
                            of characters, banners, etc to check the sheet data against,
                            which are part of how the site runs. These are never related to your personal
                            data and are not accessed, modified, or shared.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
                        <p>
                            This site relies on Google Sheets to host and manage your data. Please review Google’s own{" "}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Privacy Policy
                            </a>{" "}
                            for details on how Google handles your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Contact</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact me at{" "}
                            <a href="https://twitter.com/acronmd" className="text-blue-600 underline">
                                My Twitter Account
                            </a> or my email: aidanadame20@gmail.com
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}

export default PrivacyPolicy
