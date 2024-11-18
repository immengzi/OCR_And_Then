import Link from "next/link";

export default function Page() {
    return (
        <div className="hero bg-base-200 grow">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-6 text-5xl font-bold">
                        OCR And Then
                    </h1>
                    <ul className="steps steps-vertical lg:steps-horizontal">
                        <li className="step step-primary">file</li>
                        <li className="step step-primary">ocr</li>
                        <li className="step step-primary">prompt</li>
                        <li className="step step-primary">result</li>
                    </ul>
                    <p className="py-6">
                        Obtain text from OCR files or input directly, select specific scenarios or default prompts to chat with the LLM.
                    </p>
                    <Link href={'/play'}>
                        <button className="btn btn-primary">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}