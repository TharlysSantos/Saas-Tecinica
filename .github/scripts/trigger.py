import hashlib
import hmac
import json
import os
import requests

GATEWAY_URL = os.getenv("API_GATEWAY_URL")
API_KEY     = os.getenv("API_GATEWAY_PENTEST_KEY")

payload = {
    "event":   "build_approved",
    "commit":  os.getenv("GH_SHA", ""),
    "branch":  os.getenv("GH_REF_NAME", ""),
    "actor":   os.getenv("GH_ACTOR", ""),
    "message": os.getenv("GH_COMMIT_MSG", ""),
    "run_url": "{}/{}/actions/runs/{}".format(
        os.getenv("GH_SERVER_URL"),
        os.getenv("GH_REPOSITORY"),
        os.getenv("GH_RUN_ID")
    )
}

body = json.dumps(payload, separators=(",", ":")).encode()
sig  = "sha256=" + hmac.new(API_KEY.encode(), body, hashlib.sha256).hexdigest()

resp = requests.post(
    "{}/pentest/trigger".format(GATEWAY_URL),
    data=body,
    headers={
        "Content-Type":        "application/json",
        "X-API-Key":           API_KEY,
        "X-Hub-Signature-256": sig,
    }
)

print("Status : {}".format(resp.status_code))
print("Resposta: {}".format(resp.json()))
