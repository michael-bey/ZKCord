import React from 'react';

export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="mb-4 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
                    <p>
                        By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.
                        If you do not agree with these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. Intellectual Property</h2>
                    <p>
                        The materials contained in this website are protected by applicable copyright and trademark law.
                        Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. Disclaimer</h2>
                    <p>
                        The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">4. Limitations</h2>
                    <p>
                        In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">5. Governing Law</h2>
                    <p>
                        These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                </section>
            </div>
        </div>
    );
}
