export default function CarVisual() {
  return (
    <div className="car-visual" aria-hidden="true">
      <div className="visual-top">
        <span>
          <i /> VEHICLE INTELLIGENCE
        </span>
        <span>01 / MODEL STUDY</span>
      </div>
      <svg viewBox="0 0 660 310" fill="none" className="car-drawing">
        <defs>
          <linearGradient
            id="body"
            x1="220"
            y1="80"
            x2="320"
            y2="260"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#eff8f6" />
            <stop offset=".47" stopColor="#87a8a0" />
            <stop offset="1" stopColor="#254b43" />
          </linearGradient>
          <linearGradient
            id="window"
            x1="260"
            y1="90"
            x2="320"
            y2="170"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#223e39" />
            <stop offset="1" stopColor="#071a17" />
          </linearGradient>
        </defs>
        <ellipse cx="333" cy="250" rx="257" ry="12" fill="#000" opacity=".35" />
        <path
          d="M65 215L73 179Q80 164 137 158L217 102Q229 93 270 91L380 92Q408 94 431 116L478 157L552 171Q586 179 592 208L584 225L79 226Z"
          fill="url(#body)"
          stroke="#b5cfc7"
          strokeWidth="1.5"
        />
        <path
          d="M162 158L228 112Q242 105 271 104L377 106Q395 107 416 125L450 157Z"
          fill="url(#window)"
          stroke="#c0d5ce"
        />
        <path
          d="M284 105L280 158M375 107L389 158"
          stroke="#91aaa3"
          strokeWidth="6"
        />
        <path
          d="M166 164L263 164L264 213L174 217M280 164L391 163L410 216L282 214Z"
          stroke="#375b51"
        />
        <path
          d="M77 182L121 178L116 188L74 194M549 178L577 184L583 194L555 190"
          fill="#e1f9ef"
        />
        <path
          d="M90 204L570 204M219 172L240 172M347 172L369 172"
          stroke="#c2d8cf"
          strokeWidth="2"
        />
        <path d="M73 218H587" stroke="#102c25" strokeWidth="9" />
        {[160, 487].map((x) => (
          <g key={x}>
            <circle
              cx={x}
              cy="222"
              r="39"
              fill="#0a1311"
              stroke="#638077"
              strokeWidth="2"
            />
            <circle cx={x} cy="222" r="25" fill="#91a49e" />
            <circle cx={x} cy="222" r="20" fill="#213c33" />
            <path
              d={`M${x} 204V240M${x - 18} 222H${x + 18}M${x - 13} 209L${x + 13} 235M${x + 13} 209L${x - 13} 235`}
              stroke="#a9bbb3"
              strokeWidth="4"
            />
            <circle cx={x} cy="222" r="6" fill="#d4e3dc" />
          </g>
        ))}
        <path
          d="M70 280H590M70 276V284M590 276V284"
          stroke="#6c8e7f"
          strokeDasharray="3 5"
        />
        <path d="M327 92V46H410M137 158V48H83" stroke="#b7edbd" opacity=".6" />
        <circle cx="327" cy="92" r="4" fill="#c7f4b2" />
        <circle cx="137" cy="158" r="4" fill="#c7f4b2" />
      </svg>
      <div className="visual-caption">
        <span>Built on real listing data</span>
        <span>
          MOROCCO <b>↗</b>
        </span>
      </div>
      <div className="visual-data">
        <div>
          <span>INPUT</span>
          <strong>11 vehicle features</strong>
        </div>
        <div>
          <span>ENGINE</span>
          <strong>XGBoost regression</strong>
        </div>
        <div>
          <span>OUTPUT</span>
          <strong>Price in MAD</strong>
        </div>
      </div>
    </div>
  );
}
