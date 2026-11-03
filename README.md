


# 💳 Credit Risk Assessment & Default Prediction Using XGBoost and SHAP

An end-to-end **Machine Learning and Explainable AI (XAI)** project designed to assess loan default risk by analyzing applicant demographics, financial information, loan characteristics, and credit history.

The project uses a **Calibrated XGBoost Classification Model** to estimate loan default probability, applies an optimized decision threshold to classify applicants into Low Risk and High Risk categories, and uses **SHAP (SHapley Additive exPlanations)** to understand the factors influencing model predictions.

🚀 **Live Application:** https://credit-rate-assesment-prediction-using.onrender.com/

📂 **GitHub Repository:** https://github.com/Rahul25112003/Credit_Rate_Assesment_Prediction_Using_SHAP_

---

## 📌 Problem Statement

Credit risk assessment is an important part of lending and financial decision-making. Financial institutions need to evaluate whether a loan applicant is likely to repay a loan or potentially default.

Traditional credit assessment processes may involve manual evaluation and predefined rules, which can make risk assessment challenging when multiple financial and behavioral factors interact.

Another important challenge is model interpretability. A prediction alone does not explain why an applicant has been classified as high risk or low risk.

This project addresses these challenges by developing a Machine Learning-based credit risk assessment system that:

- Estimates the probability of loan default.
- Identifies applicants with potentially higher default risk.
- Uses an optimized classification threshold instead of relying only on the default 0.50 threshold.
- Applies SHAP to understand the influence of individual features on model predictions.
- Provides a simple interface for entering applicant information and viewing risk assessments.

The objective is to demonstrate how Machine Learning and Explainable AI can support more transparent, data-driven credit risk analysis.

## 🎯 Project Objectives

- Analyze historical loan application data.
- Perform data cleaning and exploratory data analysis (EDA).
- Identify relevant financial and demographic risk factors.
- Handle class imbalance in the target variable.
- Develop and evaluate classification models.
- Implement an XGBoost classification pipeline.
- Calibrate predicted probabilities.
- Optimize the decision threshold using the F1-score.
- Apply SHAP for global and local model interpretability.
- Deploy the trained model through a FastAPI application.

## 📊 Dataset Description

The project uses a credit risk dataset containing applicant information, loan characteristics, and historical credit information.

**Target Variable:** `loan_status`

- `0` – No loan default
- `1` – Loan default

### Features Used

| Feature | Description |
|---|---|
| person_age | Applicant's age |
| person_income | Annual income |
| person_home_ownership | Home ownership status |
| person_emp_length | Employment length |
| loan_intent | Purpose of the loan |
| loan_grade | Loan grade |
| loan_amnt | Loan amount |
| loan_int_rate | Loan interest rate |
| loan_percent_income | Loan amount as a percentage of income |
| cb_person_default_on_file | Previous default history |
| cb_person_cred_hist_length | Credit history length |

The dataset contains both numerical and categorical variables, requiring appropriate preprocessing before model training.

## 🔬 Machine Learning Workflow

The project follows a structured Machine Learning pipeline:

```text
Credit Risk Dataset
        |
        v
Data Understanding & Cleaning
        |
        v
Exploratory Data Analysis
        |
        v
Feature Selection
        |
        v
Train-Test Split
        |
        v
Data Preprocessing
        |
        v
Class Imbalance Handling
        |
        v
Model Development
        |
        v
XGBoost Classification
        |
        v
Model Evaluation
        |
        v
Probability Calibration
        |
        v
Threshold Optimization
        |
        v
SHAP Explainability
        |
        v
Model Serialization
        |
        v
FastAPI Deployment
        |
        v
Credit Risk Assessment
```

### 1. Data Preprocessing

The dataset is prepared for Machine Learning through:

- Data inspection and quality checks.
- Missing-value handling.
- Numerical and categorical feature identification.
- Feature preprocessing.
- Categorical variable encoding.
- Train-test splitting using stratification.

A preprocessing pipeline is used to handle numerical and categorical variables consistently.

### 2. Exploratory Data Analysis (EDA)

EDA is performed to understand the dataset and identify important patterns, including:

- Target variable distribution.
- Loan default distribution.
- Numerical feature distributions.
- Relationships between financial variables.
- Correlation analysis.
- Outlier investigation.
- Class imbalance analysis.

### 3. Handling Class Imbalance

Loan default datasets can contain fewer default cases than non-default cases.

To address this issue, the project incorporates class weighting through `scale_pos_weight` in the XGBoost model.

This gives additional importance to the minority default class during model training.

### 4. Model Development

The project explores classification approaches, including Logistic Regression and XGBoost.

The final deployed solution uses an XGBoost-based classification pipeline with preprocessing.

**Selected Model:**
- XGBoost Classifier
- Feature preprocessing pipeline
- Class imbalance handling
- Probability calibration

### 5. Model Evaluation

The models are evaluated using multiple classification metrics:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix
- Precision-Recall Curve

The project also uses stratified cross-validation to examine model performance across different data splits.

### 6. Probability Calibration

The project uses `CalibratedClassifierCV` with cross-validation to calibrate the XGBoost model's predicted probabilities.

Probability calibration helps make the model's estimated default probabilities more meaningful for risk assessment.

### 7. Decision Threshold Optimization

Instead of automatically using the standard 0.50 classification threshold, the project evaluates different thresholds using the Precision-Recall curve.

The threshold is selected based on the highest F1-score.

The selected threshold is approximately:

```text
Optimized Threshold: 0.611783
```

This threshold is saved separately and reused during application predictions.

### 8. Explainable AI Using SHAP

One of the important components of this project is model interpretability.

SHAP (SHapley Additive exPlanations) is used to understand how different features influence the model's predictions.

The project explores two levels of explainability:

**Global Explainability**
- Identifies the most influential features across the dataset.
- Helps understand overall model behavior.
- Uses SHAP summary plots to visualize feature importance and impact.

**Local Explainability**
- Explains the prediction for an individual applicant.
- Shows how different features contribute to a particular model output.
- Helps interpret why a specific applicant receives a higher or lower predicted default risk.

This makes the Machine Learning workflow more transparent and interpretable.

## 🌐 Deployed Application – RiskLens

The trained model is integrated into an interactive application called **RiskLens – Credit Risk Assessment**.

🔗 **Live Application:** https://credit-rate-assesment-prediction-using.onrender.com/

The application allows users to enter loan applicant information and receive an estimated default probability and risk classification.

### Application Features

- Applicant information input.
- Annual income and employment details.
- Home ownership selection.
- Loan amount and interest rate.
- Loan purpose and loan grade.
- Credit history information.
- Automatic loan-to-income ratio calculation.
- Default probability estimation.
- Low Risk / High Risk classification.
- Optimized decision threshold display.
- Risk assessment visualization.
- Sample low-risk and high-risk input profiles.

### Application Workflow

```text
Applicant Information
        |
        v
Input Validation
        |
        v
FastAPI Prediction Endpoint
        |
        v
Trained XGBoost Model
        |
        v
Default Probability
        |
        v
Optimized Threshold Comparison
        |
        v
Low Risk / High Risk
        |
        v
Assessment Result
```

## 🛠️ Technologies & Libraries

| Technology | Purpose |
|---|---|
| Python | Core programming |
| Pandas | Data manipulation and analysis |
| NumPy | Numerical computation |
| Scikit-learn | Preprocessing, evaluation and calibration |
| XGBoost | Classification model |
| SHAP | Explainable AI |
| Matplotlib | Data visualization |
| Seaborn | Exploratory data visualization |
| Joblib | Model serialization |
| FastAPI | Prediction API |
| Pydantic | Input validation |
| Uvicorn | Application server |
| HTML | Application structure |
| CSS | Interface styling |
| JavaScript | Application interaction |
| Render | Cloud deployment |

## 📁 Repository Structure

```text
Credit_Rate_Assesment_Prediction_Using_SHAP_/
│
├── static/
│   ├── index.html
│   └── style.css
│
├── Credit_Rate_Assesment_Using_SHAP_.ipynb
│   └── Complete Machine Learning workflow,
│       model development and SHAP analysis
│
├── credit_risk_dataset.csv
│   └── Credit risk dataset
│
├── credit_risk_model.pkl
│   └── Calibrated trained classification model
│
├── best_threshold.pkl
│   └── Optimized classification threshold
│
├── main.py
│   └── FastAPI prediction application
│
├── requirements.txt
│   └── Python dependencies
│
├── runtime.txt
│   └── Python runtime configuration
│
├── .python-version
│   └── Python version configuration
│
├── .gitignore
│   └── Git ignored files
│
└── README.md
    └── Project documentation
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Rahul25112003/Credit_Rate_Assesment_Prediction_Using_SHAP_.git
```

### 2. Navigate to the Project Directory

```bash
cd Credit_Rate_Assesment_Prediction_Using_SHAP_
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

### 4. Activate the Environment

**Windows:**

```bash
venv\Scripts\activate
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

For running the SHAP analysis notebook, install SHAP separately:

```bash
pip install shap matplotlib seaborn jupyter
```

## ▶️ Run the Application Locally

Start the FastAPI application using:

```bash
uvicorn main:app --reload
```

Open the application in your browser:

```text
http://127.0.0.1:8000
```

The FastAPI interactive API documentation is also available at:

```text
http://127.0.0.1:8000/docs
```

## 🔌 API Documentation

The application uses FastAPI to serve predictions.

### Prediction Endpoint

**Method:** `POST`

**Endpoint:**

```text
/predict
```

### Input Parameters

The API accepts the following applicant information:

```json
{
  "person_age": 28,
  "person_income": 60000,
  "person_home_ownership": "RENT",
  "person_emp_length": 4,
  "loan_intent": "PERSONAL",
  "loan_grade": "B",
  "loan_amnt": 10000,
  "loan_int_rate": 11.5,
  "loan_percent_income": 0.1667,
  "cb_person_default_on_file": "N",
  "cb_person_cred_hist_length": 6
}
```

### Example Response

```json
{
  "default_probability": 0.25,
  "default_prediction": 0,
  "threshold": 0.611783,
  "Result": "Low Risk"
}
```

*The response values above are illustrative. Actual predictions depend on the trained model and submitted applicant information.*

### API Output Explanation

| Output | Description |
|---|---|
| default_probability | Estimated probability of loan default |
| default_prediction | Binary classification result |
| threshold | Optimized decision threshold |
| Result | High Risk or Low Risk classification |

## 📈 Key Technical Highlights

- End-to-end credit risk classification workflow.
- Numerical and categorical feature preprocessing.
- Class imbalance handling using XGBoost class weighting.
- Comparison of Logistic Regression and XGBoost.
- Stratified cross-validation.
- Calibrated probability estimation.
- F1-score-based decision threshold optimization.
- Global and local SHAP explainability.
- Model serialization using Joblib.
- FastAPI-based model integration.
- Cloud deployment using Render.

## 🎯 Potential Business Applications

This project demonstrates concepts that can support:

- Loan default risk assessment.
- Credit risk analytics.
- Lending portfolio risk analysis.
- Financial data analysis.
- Applicant risk segmentation.
- Explainable credit decision support.
- Data-driven lending strategies.

## 🔮 Future Improvements

Potential enhancements include:

- Integrating SHAP explanations into the application interface.
- Adding applicant-level feature contribution visualizations.
- Implementing additional model comparison experiments.
- Improving probability calibration.
- Monitoring model performance over time.
- Adding model drift detection.
- Incorporating additional financial and credit history features.
- Developing more comprehensive risk analytics dashboards.

## ⚠️ Disclaimer

This project is developed for educational, analytical, and Machine Learning demonstration purposes.

The predicted default probability and risk classification are model-generated estimates and should not be treated as a final lending decision, financial advice, or a guarantee of future repayment behavior.

Real-world credit decisions require appropriate validation, regulatory compliance, fairness assessment, data privacy controls, and human oversight.

