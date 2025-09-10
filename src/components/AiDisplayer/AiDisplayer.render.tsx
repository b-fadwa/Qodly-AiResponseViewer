import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';

import { IAiDisplayerProps } from './AiDisplayer.config';

const AiDisplayer: FC<IAiDisplayerProps> = ({ style, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const [value, setValue] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    sources: { datasource: ds },
  } = useSources();

  type AIResponse =
    | { datatype: 'string'; content: string }
    | { datatype: 'image'; content: string }
    | { datatype: 'table'; content: any };

  useEffect(() => {
    if (!ds) return;

    const listener = async (/* event */) => {
      const v = await ds.getValue<AIResponse>();
      setValue(JSON.parse(v as any));
    };

    listener();

    ds.addListener('changed', listener);

    return () => {
      ds.removeListener('changed', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ds]);

  useEffect(() => {
    if (value?.datatype === 'table') {
      if (!value.content || value.content.length === 0) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [value]);

  //to render a table
  const renderList = (output: any) => {
    if (loading) {
      return (
        <div className="p-2">
          <span>{output.query}</span>
          <span className="italic">Loading...</span>
        </div>
      );
    }
    if (!output.content || !output.content.length)
      return (
        <div className="p-2 flex flex-col">
          <span>{output.content?.query}</span>
          <span>No data!</span>
        </div>
      );
    const headers = Object.keys(output.content[0]); //column names
    return (
      <div className="h-[350px] w-full overflow-y-scroll overflow-x-auto shadow-md rounded-lg">
        <span>{output?.query}</span>
        <table className="table-auto min-w-full w-full border-collapse">
          <thead className="thead">
            <tr className="text-sm">
              {headers.map((header) => (
                <th
                  className="   py-2 px-4 text-center font-semibold border border-gray-700"
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {output.content.map((row: any, rowIndex: any) => (
              <tr className="text-center text-sm even:bg-gray-50 hover:bg-gray-100" key={rowIndex}>
                {headers.map((header) => (
                  <td className=" border border-gray-700" key={header}>
                    {typeof row[header] === 'object'
                      ? JSON.stringify(row[header]) //nested object
                      : row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  const renderContent = () => {
    switch ((value as any).datatype) {
      case 'string':
        return <span>{(value as any).content}</span>;
      case 'image':
        return <img className="w-full h-3/4" src={(value as any).content} alt="AI generated" />;
      case 'table':
        return <>{renderList(value as any)}</>;
      default:
        return <span>Unsupported response type</span>;
    }
  };

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      {value && renderContent()}
    </div>
  );
};

export default AiDisplayer;
