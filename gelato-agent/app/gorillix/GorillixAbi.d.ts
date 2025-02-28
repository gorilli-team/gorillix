export declare const GORILLIX_ADDRESS = "0x14a678f6f5f5f897692a9db3dee8e2d3c656c483"
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
          readonly internalType: "address";
          readonly name: "trustedForwarder";
          readonly type: "address";
        },
        {
          readonly internalType: "string";
          readonly name: "lpTokenName";
          readonly type: "string";
        },
        {
          readonly internalType: "string";
          readonly name: "lpTokenSymbol";
          readonly type: "string";
        }
      ];
      readonly stateMutability: "nonpayable";
      readonly type: "constructor";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "spender";
          readonly type: "address";
        },
        {
          readonly internalType: "uint256";
          readonly name: "allowance";
          readonly type: "uint256";
        },
        {
          readonly internalType: "uint256";
          readonly name: "needed";
          readonly type: "uint256";
        }
      ];
      readonly name: "ERC20InsufficientAllowance";
      readonly type: "error";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "sender";
          readonly type: "address";
        },
        {
          readonly internalType: "uint256";
          readonly name: "balance";
          readonly type: "uint256";
        },
        {
          readonly internalType: "uint256";
          readonly name: "needed";
          readonly type: "uint256";
        }
      ];
      readonly name: "ERC20InsufficientBalance";
      readonly type: "error";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "approver";
          readonly type: "address";
        }
      ];
      readonly name: "ERC20InvalidApprover";
      readonly type: "error";
    },
    {
      readonly inputs: readonly [
        {
          readonly internalType: "address";
          readonly name: "receiver";
          readonly type: "address";
        }
      ];
      readonly name: "ERC20InvalidReceiver";
      readonly type: "error";
    },
    {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "ERC20InvalidSender",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "ERC20InvalidSpender",
        type: "error",
      },
      {
        inputs: [],
        name: "Gorillix__AlreadyInitialized",
        type: "error",
      },
      {
        inputs: [],
        name: "Gorillix__AmountMustBeGreaterThanZero",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "liquidityProvider",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "amountTokenA",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "amountTokenB",
            type: "uint256",
          },
        ],
        name: "AddLiquidity",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "initializer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "amountTokenA",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amountTokenB",
            type: "uint256",
          },
        ],
        name: "Initialized",
        type: "event",
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
              readonly name: "liquidityProvider";
              readonly type: "address";
            },
            {
              readonly indexed: true;
              readonly internalType: "uint256";
              readonly name: "amountLPTokensBurned";
              readonly type: "uint256";
            },
            {
              readonly indexed: true;
              readonly internalType: "uint256";
              readonly name: "amountTokenA";
              readonly type: "uint256";
            },
            {
              readonly indexed: false;
              readonly internalType: "uint256";
              readonly name: "amountTokenB";
              readonly type: "uint256";
            }
          ];
          readonly name: "RemoveLiquidity";
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
              readonly name: "outputTokenB";
              readonly type: "uint256";
            }
          ];
          readonly name: "TokenAtoTokenBSwap";
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
              readonly name: "amountTokenB";
              readonly type: "uint256";
            },
            {
              readonly indexed: true;
              readonly internalType: "uint256";
              readonly name: "outputTokenA";
              readonly type: "uint256";
            }
          ];
          readonly name: "TokenBtoTokenASwap";
          readonly type: "event";
        },
        {
          readonly anonymous: false;
          readonly inputs: readonly [
            {
              readonly indexed: true;
              readonly internalType: "address";
              readonly name: "from";
              readonly type: "address";
            },
            {
              readonly indexed: true;
              readonly internalType: "address";
              readonly name: "to";
              readonly type: "address";
            },
            {
              readonly indexed: false;
              readonly internalType: "uint256";
              readonly name: "value";
              readonly type: "uint256";
            }
          ];
          readonly name: "Transfer";
          readonly type: "event";
        },
        {
          readonly inputs: readonly [];
          readonly name: "BASIS_POINTS";
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
              readonly name: "amountTokenA";
              readonly type: "uint256";
            }
          ];
          readonly name: "addLiquidityTokenA";
          readonly outputs: readonly [
            {
              readonly internalType: "uint256";
              readonly name: "amountTokenB";
              readonly type: "uint256";
            }
          ];
          readonly stateMutability: "nonpayable";
          readonly type: "function";
        },
        {
          readonly inputs: readonly [
            {
              readonly internalType: "uint256";
              readonly name: "amountTokenB";
              readonly type: "uint256";
            }
          ];
          readonly name: "addLiquidityTokenB";
          readonly outputs: readonly [
            {
              readonly internalType: "uint256";
              readonly name: "amountTokenA";
              readonly type: "uint256";
            }
          ];
          readonly stateMutability: "nonpayable";
          readonly type: "function";
        },
        {
          readonly inputs: readonly [
            {
              readonly internalType: "address";
              readonly name: "owner";
              readonly type: "address";
            },
            {
              readonly internalType: "address";
              readonly name: "spender";
              readonly type: "address";
            }
          ];
          readonly name: "allowance";
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
              readonly internalType: "address";
              readonly name: "spender";
              readonly type: "address";
            },
            {
              readonly internalType: "uint256";
              readonly name: "value";
              readonly type: "uint256";
            }
          ];
          readonly name: "approve";
          readonly outputs: readonly [
            {
              readonly internalType: "bool";
              readonly name: "";
              readonly type: "bool";
            }
          ];
          readonly stateMutability: "nonpayable";
          readonly type: "function";
        },
        {
            readonly inputs: readonly [
              {
                readonly internalType: "address";
                readonly name: "account";
                readonly type: "address";
              }
            ];
            readonly name: "balanceOf";
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
            readonly inputs: readonly [];
            readonly name: "decimals";
            readonly outputs: readonly [
              {
                readonly internalType: "uint8";
                readonly name: "";
                readonly type: "uint8";
              }
            ];
            readonly stateMutability: "view";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "amountTokenA";
                readonly type: "uint256";
              },
              {
                readonly internalType: "uint256";
                readonly name: "reservesTokenA";
                readonly type: "uint256";
              }
            ];
            readonly name: "getLPTokensAddLiquidity";
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
                readonly name: "amountTokenA";
                readonly type: "uint256";
              },
              {
                readonly internalType: "uint256";
                readonly name: "amountTokenB";
                readonly type: "uint256";
              }
            ];
            readonly name: "getLPTokensInit";
            readonly outputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
              }
            ];
            readonly stateMutability: "pure";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [
              {
                readonly internalType: "address";
                readonly name: "user";
                readonly type: "address";
              }
            ];
            readonly name: "getLiquidityTokenAPerUser";
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
                readonly internalType: "address";
                readonly name: "user";
                readonly type: "address";
              }
            ];
            readonly name: "getLiquidityTokenBPerUser";
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
                readonly name: "amountLPTokens";
                readonly type: "uint256";
              }
            ];
            readonly name: "getPoolShare";
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
            readonly inputs: readonly [];
            readonly name: "getTotalLiquidityTokenA";
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
            readonly inputs: readonly [];
            readonly name: "getTotalLiquidityTokenB";
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
                readonly internalType: "uint256";
                readonly name: "amountTokenA";
                readonly type: "uint256";
              },
              {
                readonly internalType: "uint256";
                readonly name: "amountTokenB";
                readonly type: "uint256";
              }
            ];
            readonly name: "init";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
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
            readonly name: "name";
            readonly outputs: readonly [
              {
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
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
            readonly inputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "xInput";
                readonly type: "uint256";
              },
              {
                readonly internalType: "uint256";
                readonly name: "xReserves";
                readonly type: "uint256";
              },
              {
                readonly internalType: "uint256";
                readonly name: "yReserves";
                readonly type: "uint256";
              }
            ];
            readonly name: "price";
            readonly outputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "yOutput";
                readonly type: "uint256";
              }
            ];
            readonly stateMutability: "pure";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "amountLPTokens";
                readonly type: "uint256";
              }
            ];
            readonly name: "removeLiquidity";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
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
            readonly inputs: readonly [
              {
                readonly internalType: "address";
                readonly name: "user";
                readonly type: "address";
              }
            ];
            readonly name: "s_liquidityTokenAPerUser";
            readonly outputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "amountTokenA";
                readonly type: "uint256";
              }
            ];
            readonly stateMutability: "view";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [
              {
                readonly internalType: "address";
                readonly name: "user";
                readonly type: "address";
              }
            ];
            readonly name: "s_liquidityTokenBPerUser";
            readonly outputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "amountTokenB";
                readonly type: "uint256";
              }
            ];
            readonly stateMutability: "view";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [];
            readonly name: "s_totalLiquidityTokenA";
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
            readonly inputs: readonly [];
            readonly name: "s_totalLiquidityTokenB";
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
            readonly inputs: readonly [];
            readonly name: "symbol";
            readonly outputs: readonly [
              {
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
              }
            ];
            readonly stateMutability: "view";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "amountTokenA";
                readonly type: "uint256";
              }
            ];
            readonly name: "tokenAtoTokenB";
            readonly outputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "outputTokenB";
                readonly type: "uint256";
              }
            ];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "amountTokenB";
                readonly type: "uint256";
              }
            ];
            readonly name: "tokenBtoTokenA";
            readonly outputs: readonly [
              {
                readonly internalType: "uint256";
                readonly name: "outputTokenA";
                readonly type: "uint256";
              }
            ];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [];
            readonly name: "totalSupply";
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
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
              },
              {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
              }
            ];
            readonly name: "transfer";
            readonly outputs: readonly [
              {
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
              }
            ];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
          },
          {
            readonly inputs: readonly [
              {
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
              },
              {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
              },
              {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
              }
            ];
            readonly name: "transferFrom";
            readonly outputs: readonly [
              {
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
              }
            ];
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
  