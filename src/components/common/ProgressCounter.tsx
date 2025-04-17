import { IProgressCounter } from "../../types";

const ProgressCounter: React.FC<IProgressCounter> = ({ progress, size }) => {
  const radius = size / 2;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-counter" style={{ width: size, height: size }}>
      <svg height={size} width={size}>
        <circle
          stroke="blue"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="14"
          fill="black"
        >
          {progress}%
        </text>
      </svg>
    </div>
  );
};

export default ProgressCounter;
