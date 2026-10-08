import {userAuth} from '../hooks/useAuth';

//Temporary box for a feature that isn't merged yet.
//Each user replaces their box with the real component (which must keep the same id).
function comingSoon({id,title}:{id:string;title:string}){
    return(
        <section id={id} className='rounded-md border border-dash
        border-border bg-surface p-6'>
            <h2 className='text-title font-semibold text-text-main'>{title}</h2>
            <p className='text-small text-text-muted'>Coming Soon.this container being build on its own branch. </p>
        </section>
    );
}

export default function DashboardPage(){
    //Logged in user,for the "welcome, xxx" heading
    const{ user } = useAuth();
    return(
        //page background behind all containers
        <div className='min-h-screen bg-background'>
            <main className='mx-auto flex max- w-6xl flex-col gap-8 px-4 py-8'>

                {/* Navbar Dashboard button scrolls here */}
                <section id = "dashboard">
                {/* Small orange label with a line in front, as in the design */}
                <p className='flex items-center gap-2 text-small font-semibold uppercase tracking-widest text-secondary'>
                    <span className="h-0.5 w-6 bg-secondary" aria-hidden="true"/>
                    EVERYDAY BANKING
                </p>
                <h1 className="mt-1 text-heading font-bold text-text-main">Welcome,{user?.firstName}.</h1>
                {/* Account overview + transaction activity chart go here later */}

                </section>
                {/* One container per navbar button. The ids must match the navbar.  */}
                <comingSoon id="desposit" title="Deposit"/>
                 <comingSoon id="withdraw" title="withdraw"/>
                <comingSoon id="transfer" title="transfer"/>
                 <comingSoon id="transaction" title="Recent transactions"/>

                </main> 
        </div>
    )
}