import pandas as pd
import sqlalchemy
from sqlalchemy import text, types
import uuid

engine = sqlalchemy.create_engine(
    "", echo=False
)

gh_label_map = pd.DataFrame({'original_label': [], 'harmonized_label': []})
gh_label_map.to_sql("gh_label_map", con=engine, dtype={'original_label': types.TEXT, 'harmonized_label': types.TEXT})

users = pd.DataFrame({'token': [str(uuid.uuid4()), str(uuid.uuid4())], 'name': ['Lukas', 'Anne'] })
users.to_sql("users", con=engine)

participants_df: pd.DataFrame = pd.read_pickle('participants.p')
participants_df.to_sql('gh_participants', con=engine, method='multi', chunksize=1000)

issues_df: pd.DataFrame = pd.read_pickle("issues.p")

issues_df["issue_number"] = issues_df["issue"].apply(lambda x: x["number"])

# Remove JSON Objects
issues_df = issues_df.drop(["issue", "comments", "index"], axis=1)
issues_df = issues_df.reindex()


# Add empty column for harmonized labels
issues_df["harmonized_labels"] = None

# Add empty column for is privacy check
issues_df["is_privacy_related"] = None


# Add columns for raters
def create_rater_tables(rater: str):
    issues_df[f"privacy_issue_{rater}"] = None
    issues_df[f"consent_interaction_{rater}"] = None
    issues_df[f"resolution_{rater}"] = None
    issues_df[f"last_edit_{rater}"] = pd.Timestamp("2023-01-01")


create_rater_tables("rater_1")
create_rater_tables("rater_2")


issues_df.to_sql(
    "gh_issues",
    con=engine,
    dtype={
        "is_privacy_related": types.Boolean(),
        "discussants": types.JSON,
        "labels": types.JSON,
        "harmonized_labels": types.JSON,
        "keywords": types.JSON,
    },
    method="multi",
    chunksize=1000
)



with engine.connect() as conn:
    print(conn.execute(text("SELECT COUNT(*) FROM gh_issues")).fetchall())
