import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token;
      }

      return token;
    },
    async session({ session, token }) {
      // Add the token to the session
      if (token && session?.['user']) {
        const idToken = token?.idToken as string;
        const outputObject = {...session.user, idToken: idToken};
        session.user = outputObject;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
