interface ReadingTimeProps {
    content: string; // テキスト文字列
    readingSpeed?: number; // 読む速度（文字数/分）
  }

  const ReadingTime: React.FC<ReadingTimeProps> = ({ content, readingSpeed = 400 }) => {
    const textLength = content.length;
    const readingTime = Math.ceil(textLength / readingSpeed);

    return (
<div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-700 p-4 shadow-md">
  <span className="text-blue-800 font-semibold text-sm">
    📖 読了時間目安：
  </span>
  <span className="text-gray-700 text-sm mt-2">
    この記事は約 <span className="font-bold">{textLength}</span> 文字です。読むのに約 <span className="font-bold">{readingTime}</span> 分かかります。
  </span>
</div>

    );
  };

  export default ReadingTime;