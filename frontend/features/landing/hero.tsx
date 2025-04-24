import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { ChartNoAxesCombined, ShoppingBasket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex-1">
            <div className="flex flex-col gap-4 lg:gap-8">
              <h1 className="max-w-[80%] text-4xl leading-tight font-semibold text-foreground lg:text-5xl xl:text-7xl">
                A price tracker for your favorite products
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground xl:text-2xl">
                Import your products from supported stores and get notified when
                the price falls within a threshold you set.
              </p>
            </div>
            <div className="my-6 lg:my-10">
              <Link href="/products">
                <Button asChild size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full flex-1">
            <div className="w-full max-w-[50rem]">
              <AspectRatio ratio={1 / 1} className="h-full w-full">
                <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[3.5%]">
                  <div className="overflow-hidden rounded-[5.2%] border border-muted bg-muted">
                    <div className="grid h-full place-items-center">
                      <ShoppingBasket size="128" />
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-[5.2%] border border-muted bg-muted">
                    <div className="absolute top-1/2 left-[5%] w-[110%] max-w-[25rem] -translate-y-1/2 overflow-hidden rounded-md">
                      <AspectRatio ratio={1.739130435 / 1}>
                        <Image
                          src="/products-page.png"
                          alt=""
                          layout="fill"
                          className="size-full object-cover object-center"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-[5.2%] border border-muted bg-muted">
                    <div className="relative top-[24%] left-[50%] w-[65%] max-w-[17.5rem] -translate-x-[50%]">
                      <AspectRatio ratio={0.52 / 1}>
                        <Image
                          src="/iphone-mockup.png"
                          alt=""
                          layout="fill"
                          className="absolute z-10 w-full"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-[5.2%] border border-muted bg-muted">
                    <div className="grid h-full place-items-center">
                      <ChartNoAxesCombined size="128" />
                    </div>
                  </div>
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
