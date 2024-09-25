const ocrConfigs = [
    {name: '百度云 OCR API KEY', placeholder: ''},
    {name: '百度云 OCR SECRET KEY', placeholder: ''},
    {name: 'GPT API URL', placeholder: 'e.g. https://api.openai.com/v1'},
    {name: 'GPT API KEY', placeholder: ''}
];

export default function Play() {
    return (
        <form>
            <div className="flex flex-col justify-center gap-5 p-9">
                {ocrConfigs.map(config => (
                    <div className="flex justify-center items-center flex-col gap-3" key={config.name}>
                        <h2>{config.name}</h2>
                        <input
                            type="text"
                            placeholder={config.placeholder}
                            className="input input-bordered input-primary w-full max-w-lg"
                            required={true}
                        />
                    </div>
                ))}
                {/* Button with loading spinner and text */}
                <div className="flex items-center flex-col gap-3">
                    <h2>GPT API MODEL</h2>
                    <select className="select select-primary w-full max-w-lg">
                        <option value={"gpt-4o-mini"}>gpt-4o-mini</option>
                        <option>gpt-4o</option>
                        <option>gpt-4-turbo</option>
                        <option>gpt-4</option>
                        <option>gpt-3.5-turbo</option>
                    </select>
                </div>
                <div className="flex items-center flex-col gap-3">
                    <h2>要处理的 PDF 路径</h2>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="file-input file-input-bordered file-input-primary w-full max-w-lg"
                        required={true}
                    />
                </div>
                {/* Outline Button */}
                <div className="flex justify-center items-center flex-col gap-3">
                    <div className="flex gap-2">
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary mr-1"
                                    required={true}
                                />
                                <span className="label-text">
                                    我已阅读并同意隐私政策
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex items-center flex-col gap-3">
                    <button className="btn btn-primary w-full max-w-40" type="submit">
                        提交
                    </button>
                </div>
            </div>
        </form>
    );
}