import React, {useState} from 'react';

export interface LoadingProps {
    setLoading?: (l: boolean) => void;
  }

export const WithLoading = (WrappedComponent: any) => {
    function Loader (props: any) {
        const [isLoading, setLoading] = useState(true);

        const setLoadingState = (isComponentLoading: React.SetStateAction<boolean>) => {
            setLoading(isComponentLoading);
        }

        return (
            <div className="loader-wrapper">
                {isLoading && <div className="loader-main"></div>}
                <WrappedComponent {...props} setLoading={setLoadingState} />
            </div>
        );
    }
    return Loader;
};

export default WithLoading;