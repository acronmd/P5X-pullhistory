import React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const TermsOfService: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <Button onClick={() => navigate("/home")}>
                        ← Back
                    </Button>

                    <div className="text-center flex-1">
                        <CardTitle>Terms of Service</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Last updated: August 18, 2025
                        </p>
                    </div>

                    <div className="w-[75px]" /> {/* Spacer for alignment */}
                </CardHeader>

                <CardContent className="space-y-6">
                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Use of the Service</h2>
                        <p>
                            You may use this service only for purposes allowed by law and in accordance with these Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Data Handling</h2>
                        <p>
                            Our application does not store personal data beyond cached links to Google Sheets you explicitly choose. All sheet data remains in your Google account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
                        <p>
                            All code of this application are the property of the developer. Users may not redistribute or copy this content without permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Intellectual Property Disclaimer</h2>
                        <p>
                            Any resources, assets, or content extracted from the game are the property of their respective owners: SEGA, Atlus, and Black Wings Game Studio.
                            This application does not claim ownership of any such resources.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
                        <p>
                            This site relies on Google Sheets for data storage. By using the service, you agree to abide by Google's Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Contact</h2>
                        <p>
                            For questions regarding these Terms of Service, please contact me at{" "}
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

export default TermsOfService
