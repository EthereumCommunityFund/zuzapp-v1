import GuildedMembers from "@/components/commons/GuildedMembers";
import { Loader } from "@/components/ui/Loader";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/database.types";
import { useGuildedMembers } from "@/hooks/useGuildedMembers";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/router";

export default function About() {
  const router = useRouter();

  const { guildedMembers, isLoading, isError } = useGuildedMembers();

  if (isError) {
    toast({
      title: "Error",
      description: "Contributors Fetch Failed",
      variant: "destructive",
    });
  }

  return (
    <div className="about_container">
      <h1>What is Zuzalu?</h1>

      <h3>-2023: First Zuzalu</h3>
      <p>
        The first idea of Zuzalu started on a post
        <a
          href="https://vitalik.eth.limo/general/2021/10/31/cities.html"
          className="highlighted_p"
          target="_blank"
        >
          {" "}
          Crypto Cities
        </a>
        . Over time the idea manifested to an experiment with the first
        iteration being: Zuzalu Montenegro. The goal: Create a pop-up city that
        houses 200+ people from a diverse variety of regions and fields together
        for 2 whole months aimed to blend a variety of cultures fostering an
        environment where innovative experiments could make positive impacts on
        the world. To learn more about the idea behind Zuzalu,
        <a
          href="https://www.palladiummag.com/2023/10/06/why-i-built-zuzalu/"
          className="highlighted_p"
          target="_blank"
        >
          {" "}
          Why I Built Zuzalu.
        </a>
      </p>

      <h3>2024: Open Frontier</h3>
      <ul>
        <li>
          Coordinate on supporting digital public goods that would be common
          across these Zu-villages
        </li>
        <li>Engage in cross-pollination and intellectual discussion</li>
        <li>
          Actively encourage people, both inside the existing community and on
          the edges of it, to run their own Zu-villages and strongly consider
          providing funding
        </li>
      </ul>

      <h2>Zuzalu Software Mission</h2>
      <br />
      <p>
        To continue building open-source tools for everyone to use. Coordinate
        builders in the community to build towards application experiences and
        tools both for/and independent of the app (zuzalu.city)
      </p>

      <br />
      <br />
      <p>
        <strong>
          Values excerpt from V's
          <a
            href="https://bafybeib24abrrlurxmgedaekfz2v2eatpzo2l5cbvdoay4hnpenuzojt6a.ipfs.dweb.link/general/2023/12/28/cypherpunk.html"
            className="highlighted_p"
            target="_blank"
          >
            {" "}
            Make Ethereum Cypherpunk Again:
          </a>
        </strong>
      </p>
      <br />

      <div className="container_box">
        <p>
          Many of these values are shared not just by many in the Ethereum
          community, but also by other blockchain communities, and even
          non-blockchain decentralization communities, though each community has
          its own unique combination of these values and how much each one is
          emphasized.
        </p>
        <br />
        <p>
          <strong>Open global participation:</strong> Anyone in the world should
          be able to participate as a user, observer or developer, on a
          maximally equal footing. Participation should be permissionless.
        </p>
        <p>
          <strong>Decentralization:</strong> Minimize the dependence of an
          application on any one single actor. In particular, an application
          should continue working even if its core developers disappear forever.
        </p>
        <p>
          <strong>Censorship resistance:</strong> Centralized actors should not
          have the power to interfere with any given user's or application's
          ability to operate. Concerns around bad actors should be addressed at
          higher layers of the stack.
        </p>
        <p>
          <strong>Auditability:</strong> Anyone should be able to validate an
          application's logic and its ongoing operation (eg. by running a full
          node) to make sure that it is operating according to the rules that
          its developers claim it is.
        </p>
        <p>
          <strong>Credible neutrality:</strong> Base-layer infrastructure &nbsp;
          <a
            href="https://nakamoto.com/credible-neutrality/"
            className="highlighted_p"
            target="_blank"
          >
            should be neutral
          </a>
          , and in such a way that anyone can see that it is neutral even if
          they do not already trust the developers.
        </p>
        <p>
          <strong>Building tools, not empires:</strong> Empires try to capture
          and trap the user inside a walled garden; tools do their task but
          otherwise interoperate with a wider open ecosystem.
        </p>
        <p>
          <strong>Cooperative mindset:</strong> Even while competing, projects
          within the ecosystem cooperate on shared software libraries, research,
          security, community building and other areas that are commonly
          valuable to them. Projects try to be positive-sum, both with each
          other and with the wider world.
        </p>
      </div>
      <h1>Community Operation</h1>
      <p>
        The primary focus is to underscore interoperability between Zuzalu.city
        and various tools, ensuring seamless integration. A robust coordination
        process will be established, empowering community members to actively
        contribute and develop missing modules and components. Invitations will
        be extended to Guilded, enhancing community engagement with a focus on
        fostering meaningful and high-quality interactions.
      </p>

      <br />
      <br />
      <p>
        And for more of what we have upcoming, read the roadmap! 
        <strong>
          <a
            href="https://ducks-relate-0qn.craft.me/VLTVBxHPEyPuB1"
            className="highlighted_p_bold"
            target="_blank"
          >
            Zuzalu Software Roadmap
          </a>
        </strong>
      </p>
      <h4>View the Community Blog (Guilded)</h4>
      <p>Zuzalu Builders' Project Updates</p>
      <button className="about_btn">
        <img src="/images/zuzagora.svg" alt="" />
        <span>Community Blog</span>
        <img src="/images/btn_arrow.svg" alt="" />
      </button>

      <br />
      <br />
      <h2>
        Current List of Contributors (
        {isLoading ? "..." : guildedMembers?.length})
      </h2>
      <div className="contributors_container">
        <div className="black_overlay"></div>
        <div className="black_overlay2"></div>
        <div className="marquee">
          {isLoading ? (
            <Loader />
          ) : (
            guildedMembers?.map((member, index) => (
              <div key={index}>
                <GuildedMembers member={member} />
              </div>
            ))
          )}
        </div>
      </div>
      <h1>Build With Us:</h1>
      <h4>Join Guilded - R&D, coop building portal</h4>

      <button className="about_btn">
        <img src="/images/zuzagora.svg" alt="" />
        <span>Zuzalu Guilded</span>
        <img src="/images/btn_arrow.svg" alt="" />
      </button>
      <h4>Join Zuzagora - for existing ZuPass holders</h4>
      <button className="about_btn">
        <img src="/images/zuzagora.svg" alt="" />
        <span>Zuzagora</span>
        <img src="/images/btn_arrow.svg" alt="" />
      </button>

      <br />
      <br />
      <p>
        We eagerly await enthusiastic members to join force with existing
        community builders, and contribute and take on challenges together. Here
        are at least three ways to get involved:
      </p>

      <ol>
        <li>Co-build Shape the OS and build tools.</li>
        <li>Module/Plug-in/Extension Integrate tools into the toolkit.</li>
        <li>
          Requirements Providers (Feature R&D) Test Zuzalu infra with specific
          community experiences.
        </li>
      </ol>

      <div className="container_box">
        <p>
          "We need active human intention to choose the directions that we want,
          as the formula of "maximize profit" will not arrive at them
          automatically." <br />
          <br />
          (--"My Techn-Optimism", Nov 2023)
        </p>
      </div>
      <br />
      <br />
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient<Database>(ctx);

  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      props: {
        initialSession: null,
        user: null,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
