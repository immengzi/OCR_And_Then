import Link from "next/link";

export default function Page() {
    return (
        <div className="hero bg-base-200 grow">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-6 text-5xl font-bold">
                        TestpaperAuto
                    </h1>
                    <ul className="steps steps-vertical lg:steps-horizontal">
                        <li className="step step-primary">test paper</li>
                        <li className="step step-primary">json</li>
                        <li className="step step-primary">question</li>
                        <li className="step step-primary">answer</li>
                    </ul>
                    <p className="py-6">
                        Using Baidu Cloud OCR for text recognition and GPT for location correction, extract the text
                        from the exam PDF and then further generate reference answers using GPT.
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