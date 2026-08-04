declare module 'lucide-react' {
  import type { SVGProps } from 'react';

  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export type Icon = (props: IconProps) => JSX.Element;

  export const Search: Icon;
  export const MapPin: Icon;
  export const Home: Icon;
  export const Building2: Icon;
  export const Users: Icon;
  export const Zap: Icon;
  export const Flame: Icon;
  export const CheckCircle: Icon;
  export const AlertCircle: Icon;
  export const Loader2: Icon;
  export const ChevronDown: Icon;
  export const X: Icon;
  export const Euro: Icon;
  export const Leaf: Icon;
  export const Clock: Icon;
  export const TrendingDown: Icon;
  export const Shield: Icon;
  export const Phone: Icon;
  export const Mail: Icon;
  export const Star: Icon;
  export const Menu: Icon;
  export const ArrowRight: Icon;
  export const Award: Icon;
  export const Target: Icon;
  export const Heart: Icon;
  export const ThumbsUp: Icon;
  export const MessageCircle: Icon;
  export const Send: Icon;
  export const FileCheck: Icon;
  export const TrendingUp: Icon;
  export const Wallet: Icon;
}
