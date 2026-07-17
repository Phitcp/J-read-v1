import { JlptLevel, GrammarPointDef } from "@/features/grammar/types";

export const GRAMMAR_DATA: Record<JlptLevel, GrammarPointDef[]> = {
  N5: [
    { id: "n5-1", point: "〜てください", meaning: "Làm ơn hãy...(nhờ vả lịch sự)" },
    { id: "n5-2", point: "〜ています", meaning: "Đang làm... / trạng thái tiếp diễn" },
    { id: "n5-3", point: "〜たいです", meaning: "Muốn làm..." },
    { id: "n5-4", point: "〜ないでください", meaning: "Xin đừng làm..." },
    { id: "n5-5", point: "〜ことができます", meaning: "Có thể làm..." },
    { id: "n5-6", point: "〜前に / 〜後で", meaning: "Trước khi / sau khi" },
    { id: "n5-7", point: "〜すぎる", meaning: "Quá... (mức độ)" },
    { id: "n5-8", point: "〜なければなりません", meaning: "Phải làm..." },
  ],
  N4: [
    { id: "n4-1", point: "〜ておく", meaning: "Làm sẵn, chuẩn bị trước" },
    { id: "n4-2", point: "〜てしまう", meaning: "Lỡ làm..., làm xong hoàn toàn" },
    { id: "n4-3", point: "〜ようにする", meaning: "Cố gắng làm sao để..." },
    { id: "n4-4", point: "〜そうです（様態）", meaning: "Có vẻ như... (dựa vào quan sát)" },
    { id: "n4-5", point: "〜ば", meaning: "Nếu... thì (giả định)" },
    { id: "n4-6", point: "〜のに", meaning: "Vậy mà, thế mà (trái ngược kỳ vọng)" },
    { id: "n4-7", point: "〜ようになる", meaning: "Trở nên có thể / dần dần..." },
    { id: "n4-8", point: "〜させる", meaning: "Thể sai khiến" },
  ],
  N3: [
    { id: "n3-1", point: "〜ばかりだ", meaning: "Chỉ toàn là..., vừa mới..." },
    { id: "n3-2", point: "〜わけではない", meaning: "Không hẳn là..." },
    { id: "n3-3", point: "〜つつある", meaning: "Đang dần dần..." },
    { id: "n3-4", point: "〜に伴って", meaning: "Đi kèm với, cùng với sự..." },
    { id: "n3-5", point: "〜おかげで", meaning: "Nhờ có... (kết quả tích cực)" },
    { id: "n3-6", point: "〜せいで", meaning: "Vì... (nguyên nhân tiêu cực)" },
    { id: "n3-7", point: "〜たとたん", meaning: "Vừa mới... thì ngay lập tức" },
    { id: "n3-8", point: "〜ことになっている", meaning: "Theo quy định thì..." },
  ],
  N2: [
    { id: "n2-1", point: "〜にもかかわらず", meaning: "Mặc dù, bất kể..." },
    { id: "n2-2", point: "〜を通じて / 〜を通して", meaning: "Thông qua..." },
    { id: "n2-3", point: "〜に基づいて", meaning: "Dựa trên..." },
    { id: "n2-4", point: "〜ざるを得ない", meaning: "Không thể không làm..." },
    { id: "n2-5", point: "〜からといって", meaning: "Không phải vì... mà..." },
    { id: "n2-6", point: "〜次第だ", meaning: "Tùy thuộc vào..." },
    { id: "n2-7", point: "〜あげく", meaning: "Cuối cùng thì... (sau một quá trình)" },
    { id: "n2-8", point: "〜に応じて", meaning: "Tùy theo, ứng với..." },
  ],
  N1: [
    { id: "n1-1", point: "〜べからず", meaning: "Cấm..., không được phép..." },
    { id: "n1-2", point: "〜にたえない", meaning: "Không chịu nổi, không thể..." },
    { id: "n1-3", point: "〜が最後", meaning: "Một khi đã... thì..." },
    { id: "n1-4", point: "〜ならでは", meaning: "Chỉ có ở..., đặc trưng riêng của..." },
    { id: "n1-5", point: "〜をものともせず", meaning: "Bất chấp, không màng đến..." },
    { id: "n1-6", point: "〜きらいがある", meaning: "Có khuynh hướng (không tốt)..." },
    { id: "n1-7", point: "〜んばかりに", meaning: "Gần như là..., như thể sắp..." },
    { id: "n1-8", point: "〜てやまない", meaning: "Mãi không thôi (cảm xúc mạnh)" },
  ],
};

export const JLPT_LEVELS: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];
