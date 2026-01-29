import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useListStickerTagsQuery } from "@/redux-store/services/stickerGarageApi";
import { Loader2 } from "lucide-react";

import staticImage from "../../../assets/images/Static.png";
import dynamicImage from "../../../assets/images/Dynamic.png";
import nfcImage from "../../../assets/images/DNFC.png";
import { CompactWave } from "./WaveBackground";

const ProductCards = () => {
  const navigate = useNavigate();
  const { data: tagList, isLoading, error } = useListStickerTagsQuery();

  const stickerTypeImages: Record<string, string> = {
    STATIC: staticImage,
    DYNAMIC: dynamicImage,
    NFC: nfcImage,
  };

  const handleAddToCart = (tagId: string) => {
    console.log("Add to cart:", tagId);
  };

  const handleBuyNow = (tagId: string) => {
    console.log("Buy now:", tagId);
  };

  if (isLoading) {
    return (
      <div className='w-full bg-black py-8 flex items-center justify-center'>
        <Loader2 className='animate-spin text-white' size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full bg-black py-8 px-4'>
        <p className='text-red-400 text-center'>Failed to load products</p>
      </div>
    );
  }

  return (
    <div className='w-full bg-black py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6'>
          {tagList?.items.map((product: any) => (
            <Card
              key={product._id}
              className='border-white/[0.2] bg-transparent text-white relative hover:border-white/[0.4] transition-colors flex flex-col'
            >
              <CardHeader className='p-4'>
                <div className='w-full h-40 sm:h-48 bg-white/5 rounded-lg mb-4 overflow-hidden'>
                  <img
                    src={stickerTypeImages[product.stickerType] || staticImage}
                    alt={product.tagName}
                    className='w-full h-full object-cover'
                  />
                </div>
                <CardTitle className='text-base sm:text-lg'>
                  {product.tagName}
                </CardTitle>
                <CardDescription className='text-xs sm:text-sm text-white/70'>
                  {product.description || "QR Sticker for your vehicle"}
                </CardDescription>
              </CardHeader>

              <CardContent className='p-4 pt-0 flex-grow'>
                <p className='text-xl sm:text-2xl font-bold'>
                  ₹{product.priceWithoutToken}
                </p>
              </CardContent>

              <CardFooter className='p-4 pt-0'>
                <div className='w-full flex flex-col sm:flex-row gap-2'>
                  <Button
                    onClick={() => handleBuyNow(product._id)}
                    className='flex-1 bg-white text-black hover:bg-white/90'
                  >
                    Buy Now
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product._id)}
                    className='flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                    variant='outline'
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {/* Custom Editor Card */}
          <Card className='border-white/[0.2] bg-transparent text-white relative hover:border-white/[0.4] transition-colors flex flex-col'>
            <CardHeader className='p-4'>
              <div className='w-full h-40 sm:h-48 rounded-lg mb-4 overflow-hidden relative bg-black'>
                <CompactWave />
                <div className='absolute inset-0 flex items-center justify-center z-10'>
                  <div className='text-center px-4'>
                    <h3 className='text-lg font-bold mb-1'>Design Your Own</h3>
                    <p className='text-xs text-white/70'>Interactive Editor</p>
                  </div>
                </div>
              </div>
              <CardTitle className='text-base sm:text-lg'>
                Custom Sticker Editor
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm text-white/70'>
                Design your own unique sticker with our interactive editor
              </CardDescription>
            </CardHeader>

            <CardContent className='p-4 pt-0 flex-grow' />

            <CardFooter className='p-4 pt-0'>
              <Button
                onClick={() => navigate("/sticker-editor")}
                className='w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                variant='outline'
              >
                Open Editor
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductCards;
