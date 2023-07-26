import '@/styles/globals.scss'
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider, Slider } from '@mantine/core';
import { cache } from '@/cache';
import { colors } from "@/constants/theme";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

  return (
    <>
      <div  >
        <MantineProvider
          theme={{
            colorScheme: "light",
            fontFamily: "Plus Jakarta Sans",
            colors: {
              medify: [...colors.medify],
              medifyDark: [...colors.medifyDark],
              medifySecondary: [...colors.medifySecondary],
              medifyGrey: [...colors.medifyGrey],
            },
            defaultRadius: 0,
            primaryColor: "medify",
          }}
          withGlobalStyles
          withNormalizeCSS
          emotionCache={cache}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </div>
    </>
  );
}
