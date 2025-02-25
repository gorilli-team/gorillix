import PoolItem from './PoolItem';
import SwapComponent from './SwapComponent';

export default function SwapInterface() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
        <div className="w-full pt-2">
          <PoolItem 
            tokenPair="TKNA/TKNB"
            poolNumber="0"
            fee="0.05%"
            volume24h="$1,708,112"
            liquidity="$231,643"
            apr="0.3% - 42.9%"
            token1Image="/usd-coin-usdc-logo.png"
            token2Image="/uniswap-uni-logo.png"
          />
        </div>

        <div className="w-full flex justify-center pt-2">
          <SwapComponent />
        </div>
      </div>
    </div>
  );
}