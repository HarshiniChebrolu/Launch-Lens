import { Copy, Trash2, Eye, Star, RefreshCw } from "lucide-react";

export default function ReportCard({
  item,
  onOpen,
  onDelete,
  onDuplicate,
  onFavorite,
  onRegenerate,
}: {
  item: any;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onFavorite: () => void;
  onRegenerate: () => void;
}) {
  const report = item.report;

  return (
    <div className={`historyCard ${item.favorite ? "favoriteCard" : ""}`}>
      <div>
        <div className="cardTitleRow">
          <span className="businessLabel">
            {item.idea?.industry || "Startup"}
          </span>

          <button className="starButton" onClick={onFavorite}>
            <Star
              size={18}
              fill={item.favorite ? "currentColor" : "none"}
            />
          </button>
        </div>

        <h2>{item.title}</h2>
        <p>{report?.summary?.slice(0, 140)}...</p>
      </div>

      <div className="historyMeta">
        <span>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </span>
        <span>Risk: {report?.security?.riskLevel || "Unknown"}</span>
        <span>
          Model: {report?.business?.primaryModel || "Not available"}
        </span>
      </div>

      <div className="historyActions">
        <button onClick={onOpen}>
          <Eye size={16} />
          Open
        </button>

        <button onClick={onRegenerate}>
          <RefreshCw size={16} />
          Regenerate
        </button>

        <button onClick={onDuplicate}>
          <Copy size={16} />
          Duplicate
        </button>

        <button onClick={onDelete} className="dangerBtn">
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}