export default function Help() {
    return (
        <div className="max-w-3xl w-full">
            <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary">
                    这里是帮助页面
                </div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-secondary">
                    或许你需要一些帮助？
                </div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-accent">
                    如果你有任何问题，请随时联系我们
                </div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-info">
                    帮助是我们的荣幸
                </div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-success">
                    我们会尽力解决你的问题
                </div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-warning">
                    但是我们不能保证一定能解决
                </div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-error">
                    请谅解
                </div>
            </div>
        </div>
    )
}