import os
from pathlib import Path


def preload(parser):
    # Check if Cozy-Nest is enabled (Cozy-Nest folder exists in extensions)
    # If yes, return
    if Path(os.path.dirname(__file__), "../Cozy-Nest").exists() and Path(os.path.dirname(__file__), "../Cozy-Nest-Dev").exists():
        return

    # parser.add_argument(
    #     "--cozy-nest-session_secret_key",
    #     type=str,
    #     help="Secret key for session cookie",
    #     default=None,
    # )
    # parser.add_argument(
    #     "--cozy-auth",
    #     type=str,
    #     help="Comma-separated list of username:password pairs for basic auth",
    #     default=None,
    # )
    parser.add_argument(
        "--cozy-nest-debug",
        action="store_true",
        help="Enable debug logging",
    )
