import CarVisual from "@/components/car-visual";
import PredictionForm from "@/components/prediction-form";

const github = "https://github.com/Anass-Erf/car_price_prediction";
const steps = [
  [
    "01",
    "Describe your car",
    "Choose its make, model and the details that make it yours.",
  ],
  [
    "02",
    "Prepare the features",
    "The saved pipeline scales numbers and encodes vehicle categories.",
  ],
  [
    "03",
    "Run the model",
    "XGBoost combines learned decision trees to estimate the listing price.",
  ],
  [
    "04",
    "Explore the estimate",
    "Get a value in Moroccan dirhams alongside your submitted details.",
  ],
];
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#prediction">
        Skip to prediction
      </a>
      <header className="site-header">
        <nav className="container nav" aria-label="Main navigation">
          <a href="#" className="brand">
            <span className="brand-icon">
              C<span>↗</span>
            </span>
            CarPrice<span className="brand-ai">AI</span>
          </a>
          <div className="nav-links">
            <a href="#prediction">Prediction</a>
            <a href="#how-it-works">How it works</a>
            <a href="#model">The model</a>
            <a href="#about">About</a>
          </div>
          <a
            className="github-link"
            href={github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span>↗</span>
          </a>
        </nav>
      </header>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> MACHINE LEARNING, MEET THE ROAD
            </p>
            <h1>
              A clearer view
              <br />
              of your car’s <em>value.</em>
            </h1>
            <p className="hero-description">
              Turn vehicle details into a data-informed price estimate. Explore
              the Moroccan used-car market through machine learning.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#prediction">
                Try the model <span>↗</span>
              </a>
              <a className="text-link" href="#how-it-works">
                See how it works <span>↓</span>
              </a>
            </div>
            <p className="hero-note">Open source. Real model. No sign-up.</p>
          </div>
          <CarVisual />
        </section>
        <div className="facts-strip">
          <div className="container facts">
            <p>
              <strong>53,391</strong>
              <span>cleaned vehicle listings</span>
            </p>
            <p>
              <strong>11</strong>
              <span>vehicle input features</span>
            </p>
            <p>
              <strong>XGBoost</strong>
              <span>regression pipeline</span>
            </p>
            <p>
              <strong>MAD</strong>
              <span>Moroccan dirham</span>
            </p>
          </div>
        </div>
        <section id="prediction" className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / THE PREDICTION LAB</p>
              <h2>
                Every car has a story.
                <br />
                Start with the details.
              </h2>
            </div>
            <p>
              Tell us about your vehicle. We’ll put the
              <br className="desktop-break" /> model to work.
            </p>
          </div>
          <PredictionForm />
        </section>
        <section id="how-it-works" className="process-section">
          <div className="container section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / UNDER THE HOOD</p>
                <h2>From details to dirhams.</h2>
              </div>
              <p>One request. A complete ML pipeline.</p>
            </div>
            <ol className="process-grid">
              {steps.map(([number, title, description]) => (
                <li key={number}>
                  <div className="step-top">
                    <span>{number}</span>
                    <span aria-hidden="true">→</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section id="model" className="section container model-section">
          <div>
            <p className="eyebrow">03 / BUILT ON MACHINE LEARNING</p>
            <h2>
              A real model.
              <br />
              An honest estimate.
            </h2>
            <p className="body-copy">
              A gradient-boosted tree model learns relationships between vehicle
              characteristics and asking prices. Its fitted preprocessing and
              estimator travel together in one saved pipeline.
            </p>
            <a
              className="text-link"
              href={`${github}#machine-learning-pipeline`}
            >
              Explore the implementation <span>↗</span>
            </a>
          </div>
          <div className="model-card">
            <div className="model-card-header">
              <span className="status-dot" />
              <span>MODEL SPECIFICATION</span>
              <span className="version-tag">v1 / 2025 data</span>
            </div>
            <dl>
              <div>
                <dt>Algorithm</dt>
                <dd>XGBoost regressor</dd>
              </div>
              <div>
                <dt>Configuration</dt>
                <dd>400 trees · depth 6</dd>
              </div>
              <div>
                <dt>Preprocessing</dt>
                <dd>Scaling + fitted encoders</dd>
              </div>
              <div>
                <dt>Training snapshot</dt>
                <dd>53,391 cleaned listings</dd>
              </div>
              <div>
                <dt>Holdout performance</dt>
                <dd>Not verified for this artifact</dd>
              </div>
            </dl>
            <p className="model-caveat">
              The original pipeline was fitted on the full cleaned dataset.
              Experiment scores are documented separately; they are not
              presented as this model’s accuracy.
            </p>
          </div>
        </section>
        <section id="about" className="about-section">
          <div className="container section about-grid">
            <div>
              <p className="eyebrow">04 / ABOUT THE PROJECT</p>
              <h2>Beyond the notebook.</h2>
            </div>
            <div>
              <p className="about-lead">
                An end-to-end ML application for a practical question: what
                might a used car be worth?
              </p>
              <p className="body-copy">
                This project connects historical Moroccan vehicle listings, a
                reusable prediction pipeline and a responsive web experience.
                Next.js handles the interface; FastAPI validates requests and
                serves the trained model. Training runs separately from the
                application.
              </p>
              <div className="tech-tags">
                {[
                  "Python",
                  "Pandas",
                  "scikit-learn",
                  "XGBoost",
                  "FastAPI",
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                ].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container footer">
        <a href="#" className="brand">
          CarPrice<span className="brand-ai">AI</span>
        </a>
        <p>A portfolio project in applied machine learning.</p>
        <a href={github} target="_blank" rel="noreferrer">
          View source ↗
        </a>
      </footer>
    </>
  );
}
