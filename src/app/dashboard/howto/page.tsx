"use client";
import AppScene from "@/components/AppScene";
import React from "react";
import Section from "@/components/Section";

export default function Page() {
  return (
    <AppScene title="How to create a shop">
      <Section title="Why manual setup is necessary">
        <p>
          Due to Telegram&apos;s robust security features, the process of
          creating a bot and setting up payment integration must be done by you,
          the shop owner. Telegram&apos;s policies are designed to protect both
          you and your customers by ensuring that all integrations are securely
          managed by the account holder. This step-by-step process ensures that
          your shop operates securely and efficiently on the Telegram platform.
        </p>
      </Section>
      <Section className="mt-6" title="Create your bot on Telegram">
        <p>
          Visit{" "}
          <a className="font-medium underline" href="https://t.me/botfather">
            BotFather
          </a>
          , Telegram&apos;s bot management tool, and follow the instructions to
          create a new bot.
        </p>
      </Section>
      <Section className="mt-6" title="Setup a payment provider">
        <p>
          White still on BotFather, navigate to your bot settings, then to
          Payments, and connect a payment provider of your choice, such as
          Stripe. You&apos;ll need to follow the provider&apos;s setup process.
        </p>
        <p>
          The provider token is used to generate invoices for users when they
          checkout.
        </p>
        <p>
          Once the user receives the invoice, they will follow the payment
          instructions issued by the custom integration between the payment
          provider and Telegram.{" "}
        </p>
        <p>
          This platform receives invoice updates for reporting purposes and has
          no control over the payment process.
        </p>
      </Section>
      <Section className="mt-6" title="Still need help?">
        <p>
          If you have any questions or need assistance setting up your shop,
          please reach out to us at{" "}
          <a
            className="font-medium underline"
            href="mailto:support@gramshop.co
          "
          >
            support@gramshop.co
          </a>
        </p>
      </Section>
    </AppScene>
  );
}
