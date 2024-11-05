export const usePlay = () => {
    const ocr = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/play/ocr', {
            method: 'POST',
            body: formData
        });
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.message || 'OCR failed')
        }
        return true
    }

    return {
        ocr
    }
}