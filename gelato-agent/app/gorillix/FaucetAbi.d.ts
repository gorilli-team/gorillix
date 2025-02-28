export declare const FAUCET_ADDRESS = "0x76995801f053d689f7e06e5e23e984caa31fbcf8"
export declare const ABI: readonly [
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "_tokenA";
          readonly type: "address";
        },
        {
          readonly internalType: "address";
          readonly name: "_tokenB";
          readonly type: "address";
        },
        {
          readonly internalType: "uint256";
          readonly name: "_faucetAmount";
          readonly type: "uint256";
        },
        {
          readonly internalType: "address";
          readonly name: "trustedForwarder";
          readonly type: "address";
        }
      ];
      readonly stateMutability: "nonpayable";
      readonly type: "constructor";
    },
    {
      readonly inputs: readonly [];
      readonly name: "Faucet__InsufficientBalance";
      readonly type: "error";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "owner";
          readonly type: "address";
        }
      ];
      readonly name: "OwnableInvalidOwner";
      readonly type: "error";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "account";
          readonly type: "address";
        }
      ];
      readonly name: "OwnableUnauthorizedAccount";
      readonly type: "error";
    },
    {
      readonly anonymous: false;
      readonly inputs: readonly [
        {
          readonly indexed: true;
          readonly internalType: "address";
          readonly name: "previousOwner";
          readonly type: "address";
        },
        {
          readonly indexed: true;
          readonly internalType: "address";
          readonly name: "newOwner";
          readonly type: "address";
        }
      ];
      readonly name: "OwnershipTransferred";
      readonly type: "event";
    },
    {
      readonly anonymous: false;
      readonly inputs: readonly [
        {
          readonly indexed: true;
          readonly internalType: "address";
          readonly name: "user";
          readonly type: "address";
        },
        {
          readonly indexed: true;
          readonly internalType: "uint256";
          readonly name: "amountTokenA";
          readonly type: "uint256";
        },
        {
          readonly indexed: true;
          readonly internalType: "uint256";
          readonly name: "amountTokenB";
          readonly type: "uint256";
        }
      ];
      readonly name: "RequestFaucet";
      readonly type: "event";
    },
    {
      readonly anonymous: false;
      readonly inputs: readonly [
        {
          readonly indexed: true;
          readonly internalType: "uint256";
          readonly name: "newFaucetAmount";
          readonly type: "uint256";
        }
      ];
      readonly name: "SetFaucetAmount";
      readonly type: "event";
    },
    {
      readonly inputs: readonly [];
      readonly name: "i_tokenA";
      readonly outputs: readonly [
        {
          readonly internalType: "contract IERC20";
          readonly name: "";
          readonly type: "address";
        }
      ];
      readonly stateMutability: "view";
      readonly type: "function";
    },
    {
      readonly inputs: readonly [];
      readonly name: "i_tokenB";
      readonly outputs: readonly [
        {
          readonly internalType: "contract IERC20";
          readonly name: "";
          readonly type: "address";
        }
      ];
      readonly stateMutability: "view";
      readonly type: "function";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "forwarder";
          readonly type: "address";
        }
      ];
      readonly name: "isTrustedForwarder";
      readonly outputs: readonly [
        {
          readonly internalType: "bool";
          readonly name: "";
          readonly type: "bool";
        }
      ];
      readonly stateMutability: "view";
      readonly type: "function";
    },
    {
      readonly inputs: readonly [];
      readonly name: "owner";
      readonly outputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "";
          readonly type: "address";
        }
      ];
      readonly stateMutability: "view";
      readonly type: "function";
    },
    {
      readonly inputs: readonly [];
      readonly name: "renounceOwnership";
      readonly outputs: readonly [];
      readonly stateMutability: "nonpayable";
      readonly type: "function";
    },
    {
      readonly inputs: readonly [];
      readonly name: "requestFaucet";
      readonly outputs: readonly [];
      readonly stateMutability: "nonpayable";
      readonly type: "function";
    },
    {
      readonly inputs: readonly [];
      readonly name: "s_faucetAmount";
      readonly outputs: readonly [
        {
          readonly internalType: "uint256";
          readonly name: "";
          readonly type: "uint256";
        }
      ];
      readonly stateMutability: "view";
      readonly type: "function";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "uint256";
          readonly name: "_newFaucetAmount";
          readonly type: "uint256";
        }
      ];
      readonly name: "setFaucetAmount";
      readonly outputs: readonly [];
      readonly stateMutability: "nonpayable";
      readonly type: "function";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "newOwner";
          readonly type: "address";
        }
      ];
      readonly name: "transferOwnership";
      readonly outputs: readonly [];
      readonly stateMutability: "nonpayable";
      readonly type: "function";
    }
  ];
  