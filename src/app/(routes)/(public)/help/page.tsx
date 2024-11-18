import { Search } from "lucide-react";
import Link from 'next/link';

export default function Help() {
    const sections = [
        {
            title: "About",
            content: [
                {
                    question: "What is this website?",
                    answer: `This is a third-party AI application designed to process low-quality examination papers through OCR technology or engage in direct text-based conversations with LLMs (Large Language Models) to help users achieve their desired outcomes.

Currently, custom prompts are not supported, but we're excited to announce that this feature will be launching soon.`
                }
            ]
        },
        {
            title: "Getting Started",
            content: [
                {
                    question: "How to use this application?",
                    answer: `To get started, follow these simple steps:

1. Register an account on our website
2. Log in to your account
3. Visit the Play page to start conversations with the LLM

Ready to begin? `,
                    hasLink: true,
                    linkText: "Go to Play page",
                    linkUrl: "/play"
                }
            ]
        },
        {
            title: "Privacy & Security",
            content: [
                {
                    question: "How is my data handled?",
                    answer: `We take your privacy seriously. Here's how we handle your data:

• User Information: All user information is encrypted and stored securely in our server database
• Uploaded Files: Files are stored on cloud platforms
• Access Policy: We will not actively view your uploaded files without authorization
• Cloud Platform Notice: Please note that we cannot prevent cloud platforms from conducting their standard file reviews and audits`
                }
            ]
        },
        {
            title: "Support",
            content: [
                {
                    question: "Having issues?",
                    answer: `If you encounter any problems or have questions, please don't hesitate to reach out to our support team.

You can contact us at: `,
                    hasLink: true,
                    linkText: "immengzi@outlook.com",
                    linkUrl: "mailto:immengzi@outlook.com"
                }
            ]
        }
    ];

    return (
        <div className="drawer lg:drawer-open p-3">
            <input id="help-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main content */}
            <div className="drawer-content flex flex-col">
                <label htmlFor="help-drawer" className="btn btn-primary drawer-button lg:hidden mb-4">
                    Open Help Menu
                </label>

                <div className="p-8">
                    {sections.map((section, index) => (
                        <div key={index} className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 text-base-content">{section.title}</h2>
                            {section.content.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    id={item.question.toLowerCase().replace(/\s+/g, '-')}
                                    className="mb-8"
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-base-content">{item.question}</h3>
                                    <div className="prose prose-base-content max-w-none text-base-content/80 space-y-4 whitespace-pre-wrap">
                                        {item.answer}
                                        {item.hasLink && (
                                            <div className="mt-2">
                                                {item.linkUrl.startsWith('mailto:') ? (
                                                    <a
                                                        href={item.linkUrl}
                                                        className="link link-primary"
                                                    >
                                                        {item.linkText}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        href={item.linkUrl}
                                                        className="link link-primary"
                                                    >
                                                        {item.linkText}
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="help-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="bg-base-100 w-80 min-h-full p-4">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold mb-4 text-base-content">Help Center</h1>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-8 pr-4 py-2 input input-bordered input-sm text-sm"
                            />
                            <Search className="w-4 h-4 absolute left-2.5 top-3 text-base-content/60" />
                        </div>
                    </div>

                    <nav>
                        {sections.map((section, index) => (
                            <div key={index} className="mb-4">
                                <h2 className="text-sm font-semibold text-base-content mb-2">
                                    {section.title}
                                </h2>
                                <ul className="space-y-1">
                                    {section.content.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            <a
                                                href={`#${item.question.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="text-sm text-base-content/70 hover:text-primary block py-1"
                                            >
                                                {item.question}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}