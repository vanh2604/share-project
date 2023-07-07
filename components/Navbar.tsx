import Link from "next/link";
import Image from "next/image";
import AuthProviders from "./AuthProvider";
import {useSession} from "next-auth/react";
import ProfileMenu from "./ProfileMenu";
import Button from "./Button";


const Navbar = () => {
    const { data: session, status } = useSession()
    return (
        <nav className='flexBetween navbar'>
            <div className='flex-1 flexStart gap-10'>
                <Link href='/'>
                    <Image
                        src='/logo.svg'
                        width={116}
                        height={43}
                        alt='logo'
                    />
                </Link>
            </div>

            <div className='flexCenter gap-4'>
                {session?.user ? (
                    <>
                        <ProfileMenu session={session}/>
                        <Link href="/create-project">
                            <Button title="Share work" />
                        </Link>
                    </>
                     )
                    : <AuthProviders />}
            </div>
        </nav>
    );
};


export default Navbar