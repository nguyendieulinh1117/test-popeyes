import React, { useMemo } from 'react'
import styles from './index.module.scss';
import IconRight from '@assets/icons/pagination-right.svg';
import classNames from "classnames";
import IconLeft from '@assets/icons/pagination-left.svg';

type Proptype = {
    totalPage,
    currentpage,
    onChange,
    pageParams,
}

const Pagination =  (props: Proptype) => {
    const {totalPage, currentpage, onChange, pageParams} = props;
    const renderPagination = useMemo(()=>{
        let render: any[] = [];
        if(totalPage <= 7) {
          for (let index = 1; index <= totalPage; index++) {
            render.push(
              <li
                onClick={() => onChange(index)}
                className={classNames({
                  [styles.active]: currentpage === index,
                })}
              >
                {index}
              </li>
            );
          }

          return <>
          <li
            onClick={() => onChange(pageParams - 1)}
            className={classNames({
                [styles.disable]: currentpage <= 1,
            })}
            >
            <IconLeft />
          </li>
          {render}
          <li
            onClick={() => onChange(pageParams + 1)}
            className={classNames({
              [styles.disable]: totalPage <= pageParams,
            })}
          >
            <IconRight />
          </li>
      </>;

        } else if(currentpage > totalPage - 4 && currentpage <= totalPage){
          for (let index = totalPage - 4; index < totalPage; index++) {
            render.push(
              <li
                onClick={() => onChange(index)}
                className={classNames({
                  [styles.active]: currentpage === index,
                })}
              >
                {index}
              </li>
            );
          }
        } else {
          if(currentpage <= 4){
            for (let index = 2; index <= 5; index++) {
              render.push(
                <li
                  onClick={() => onChange(index)}
                  className={classNames({
                    [styles.active]: currentpage === index,
                  })}
                >
                  {index}
                </li>
              );
            }
          } else {
            for (let index = currentpage -1 ; index <= currentpage + 1; index++) {
              render.push(
                <li
                  onClick={() => onChange(index)}
                  className={classNames({
                    [styles.active]: currentpage === index,
                  })}
                >
                  {index}
                </li>
              );
            }
          }
        }

        return <>
            <li
              onClick={() => onChange(pageParams - 1)}
              className={classNames({
                  [styles.disable]: currentpage <= 1,
              })}
              >
              <IconLeft />
            </li>
            <li 
              onClick={() => onChange(1)}
              className={classNames({
                [styles.active]: currentpage === 1,
              })}
            >
              1
            </li>
            {
              currentpage > 4 &&
              <li className={styles.disable}>
                ...
              </li>
            }
            {render}
            {
              currentpage <= totalPage - 4 &&
              <li className={styles.disable}>
                ...
              </li>
            }
            <li 
              onClick={() => onChange(totalPage)}
              className={classNames({
                [styles.active]: currentpage === totalPage,
              })}
            >
              {totalPage}
            </li>
            <li
              onClick={() => onChange(pageParams + 1)}
              className={classNames({
                [styles.disable]: totalPage <= pageParams,
              })}
            >
              <IconRight />
            </li>
        </>;
    }, [totalPage, currentpage])

    return ( 
        <ul className={styles.pagination}>
            {
                renderPagination
            }
        </ul>
     );
}

export default Pagination;