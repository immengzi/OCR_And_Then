import MDEditor from '@uiw/react-md-editor';
import {usePlayStore} from '@/store/slices/play-slice';
import {useTheme} from "@/context/ThemeContext";
import {usePlay} from "@/hooks/use-play";

const tabs = [
    {id: 'ocr', label: 'OCR'},
    {id: 'answer', label: 'Answer'},
    {id: 'summary', label: 'Summary'}
] as const;

export const TabSection = () => {
    const {currentTab, contents, isOcrCompleted, setTab, setContent} = usePlayStore();
    const {answer, summary} = usePlay();
    const {theme} = useTheme();

    const handleTabClick = async (tab: typeof tabs[number]['id']) => {
        if (tab !== 'ocr' && !isOcrCompleted) return;
        const ocrResult = contents['ocr'];
        if (tab === 'answer' && contents['answer'] === '') {
            await answer(ocrResult);
        } else if (tab === 'summary' && contents['summary'] === '') {
            await summary(ocrResult);
        } else {
            setTab(tab);
        }
    };

    const handleContentChange = (value?: string) => {
        if (value !== undefined) {
            setContent(currentTab, value);
        }
    };

    return (
        <div className="container mx-auto p-4 h-full">
            <div className="flex space-x-1 border-b border-neutral">
                {tabs.map(({id, label}) => (
                    <button
                        key={id}
                        onClick={() => handleTabClick(id)}
                        className={`
                            px-4 py-2 
                            ${currentTab === id ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}
                            ${id !== 'ocr' && !isOcrCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary'}
                        `}
                        disabled={id !== 'ocr' && !isOcrCompleted}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="w-full">
                <div data-color-mode={theme}>
                    <MDEditor
                        value={contents[currentTab]}
                        onChange={handleContentChange}
                        height={780}
                        preview="live"
                    />
                </div>
            </div>
        </div>
    );
}