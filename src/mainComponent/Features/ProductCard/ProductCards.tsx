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
import staticImage from "../../../assets/images/Static.png";
import dynamicImage from "../../../assets/images/Dynamic.png";
import nfcImage from "../../../assets/images/DNFC.png";

const ProductCards = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      title: "Static QR Sticker",
      description:
        "Permanent QR code for your vehicle with emergency contact information",
      price: 399,
      image: staticImage,
    },
    {
      id: 2,
      title: "Dynamic QR Sticker",
      description:
        "Update your contact details anytime without replacing the sticker",
      price: 499,
      image: dynamicImage,
    },
    {
      id: 3,
      title: "Dynamic + NFC QR Sticker",
      description:
        "Advanced sticker with NFC tap-to-call functionality and updatable QR code",
      price: 599,
      image: nfcImage,
    },
    {
      id: 4,
      title: "Custom Sticker Editor",
      description: "Design your own unique sticker with our interactive editor",
      price: null,
      image: "/custom-editor.png",

      isEditor: true,
    },
  ];

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart:", productId);
  };

  const handleBuyNow = (productId: number) => {
    console.log("Buy now:", productId);
  };

  return (
    <div className='w-full bg-black py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6'>
          {products.map((product) => {
            return (
              <Card
                key={product.id}
                className='border-white/[0.2] bg-transparent text-white relative hover:border-white/[0.4] transition-colors flex flex-col'
              >
                <CardHeader className='p-4'>
                  <div className='w-full h-40 sm:h-48 bg-white/5 rounded-lg mb-4 overflow-hidden'>
                    <img
                      src={product.image}
                      alt={product.title}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <CardTitle className='text-base sm:text-lg'>
                    {product.title}
                  </CardTitle>
                  <CardDescription className='text-xs sm:text-sm text-white/70'>
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className='p-4 pt-0 flex-grow'>
                  {!product.isEditor && (
                    <p className='text-xl sm:text-2xl font-bold'>
                      ₹{product.price}
                    </p>
                  )}
                </CardContent>

                <CardFooter className='p-4 pt-0'>
                  {product.isEditor ? (
                    <Button
                      onClick={() => navigate("/sticker-editor")}
                      className='w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                      variant='outline'
                    >
                      Open Editor
                    </Button>
                  ) : (
                    <div className='w-full flex flex-col sm:flex-row gap-2'>
                      <Button
                        onClick={() => handleBuyNow(product.id)}
                        className='flex-1 bg-white text-black hover:bg-white/90'
                      >
                        Buy Now
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(product.id)}
                        className='flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                        variant='outline'
                      >
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductCards;
